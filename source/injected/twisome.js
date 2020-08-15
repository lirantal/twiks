const UNDO_DELAY_TIME = 5000
const DELAY_TIME_ATTACH_UNDO_BUTTON = 1500
const COUNT_DOWN_TIMER_TIME = 1000
const DELAY_TIME_START_SEARCH_ON_PAGE = 2000
const TWITTER_BUTTON_SELECTOR = '[data-testid="tweetButtonInline"]'
const UNDO_BUTTON_SELECTOR_ID = 'undotweetButtonInline'
const UNDO_BUTTON_TEXT_SELECTOR_ID = 'undoText'
const TWITTER_PROGRESSBAR_SELECTOR = '[role="progressbar"]'

let tweetInProgress = false
let continueWithTweet = false
let currentEventId
let timerRef
let eventCounter = 1

function delayedTweet(eventId) {
  // every second:
  // - if not eventId kill the timer
  //    - reset the button
  // - if time since started + 10 is passed the time now
  //    - kill the timer and call the function
  let timer = UNDO_DELAY_TIME / 1000

  clearInterval(timerRef)
  timerRef = setInterval(() => checkStatus(eventId, timerRef), COUNT_DOWN_TIMER_TIME)

  const undoButtonText = document.getElementById(UNDO_BUTTON_TEXT_SELECTOR_ID)
  undoButtonText.innerText = `Undo in ${timer}`

  function checkStatus(eventId, timerRef) {
    const undoButton = document.getElementById(UNDO_BUTTON_SELECTOR_ID)

    if (currentEventId !== eventId) {
      clearInterval(timerRef)
      return
    }

    if (!undoButton) {
      clearInterval(timerRef)
      tweetInProgress = false
      continueWithTweet = false
      return
    }

    if (timer <= 0) {
      clearInterval(timerRef)
      undoButtonDisable({ resetText: true })

      const tweetButton = document.querySelectorAll(TWITTER_BUTTON_SELECTOR)[0]
      tweetButton.click()
      return
    }

    if (!isTweetable()) {
      clearInterval(timerRef)
      tweetInProgress = false
      continueWithTweet = false
      attachEventHandler()
      undoButtonDisable({ resetText: true })
      return
    }

    timer--
    undoButtonText.innerText = `Undo in ${timer}`
  }
}

function isTweetable() {
  const tweetProgressBar = document.querySelectorAll(TWITTER_PROGRESSBAR_SELECTOR)
  return !!(tweetProgressBar.length > 1)
}

function undoButtonDisable({ resetText = false }) {
  const undoButton = document.getElementById(UNDO_BUTTON_SELECTOR_ID)

  if (undoButton) {
    undoButton.style.pointerEvents = 'none'
    undoButton.style.opacity = '0.5'
    undoButton.setAttribute('disabled', true)

    if (resetText === true) {
      const undoButtonText = document.getElementById(UNDO_BUTTON_TEXT_SELECTOR_ID)
      undoButtonText.innerText = 'Undo'
    }
  }
}

function undoButtonEnable() {
  const undoButton = document.getElementById(UNDO_BUTTON_SELECTOR_ID)
  undoButton.removeAttribute('disabled')
  undoButton.style.pointerEvents = 'auto'
  undoButton.style.opacity = '1'
}

function attachEventHandler() {
  const tweetButton = document.querySelectorAll(TWITTER_BUTTON_SELECTOR)[0]
  tweetButton.addEventListener(
    'click',
    function (event) {
      if (!isTweetable()) {
        tweetInProgress = true
        continueWithTweet = true

        event.preventDefault()
        event.stopPropagation()

        attachEventHandler()
        return false
      }

      let id = eventCounter++
      currentEventId = id

      event.preventDefault()
      event.stopPropagation()

      tweetInProgress = true
      continueWithTweet = true

      undoButtonEnable()
      delayedTweet(currentEventId)
    },
    { once: true, capture: true }
  )

  const undoButton = document.getElementById(UNDO_BUTTON_SELECTOR_ID)
  if (!undoButton) {
    createNewUndoNode()
  }
}

function createNewUndoNode() {
  let undoElement = document.createElement('div')
  undoElement.setAttribute('id', UNDO_BUTTON_SELECTOR_ID)
  undoElement.innerHTML = `
  <div
    role="button"
    style="background-color: rgb(224, 36, 94);
      border-radius: 20px;
      min-width: calc(102.79px);
      min-height: 39px;
      margin-left: 10px;
      outline-style: none;
      margin-top: 10px;
      -webkit-box-align: center;
      align-items: center;
      -webkit-box-direction: normal;
      -webkit-box-orient: horizontal;
      flex-direction: row;
      text-align: center;
      max-width: 100%;
      display: flex;
      height: 0px;
      margin-right: -15px;"
  >
    <div
      id="undoText"
      style="font-family: system-ui, -apple-system, BlinkMacSystemFont, Roboto, Ubuntu, 'Helvetica Neue', sans-serif; 
      cursor: pointer;
      font-size: 15px;
      overflow-wrap: break-word;
      min-width: 0px;
      line-height: 1;
      -webkit-box-align: center;
      align-items: center;
      -webkit-box-pack: center;
      justify-content: center;
      -webkit-box-flex: 1;
      flex-grow: 1;
      -webkit-box-direction: normal;
      -webkit-box-orient: horizontal;
      flex-direction: row;
      text-align: center;
      max-width: 100%; 
      display: flex;
      color: white;
      font-weight: bold;
      "
    >
      Undo
    </div>
  </div>`

  let tweetButton = document.querySelectorAll(TWITTER_BUTTON_SELECTOR)[0]
  let toolBar = tweetButton.parentElement.parentElement
  toolBar.insertBefore(undoElement, toolBar.childNodes[1])

  undoElement.style.opacity = '0.5'
  undoElement.style.pointerEvents = 'none'
  undoElement.addEventListener('click', (event) => {
    if (tweetInProgress) {
      undoButtonDisable({ resetText: true })

      tweetInProgress = false
      continueWithTweet = false
      clearInterval(timerRef)

      attachEventHandler()
    }
  })
}

// Callback function to execute when mutations are observed
function mutationObserverForTweetButton(mutationsList, observer) {
  setTimeout(function () {
    const undoButton = document.getElementById(UNDO_BUTTON_SELECTOR_ID)
    let tweetButton = document.querySelectorAll(TWITTER_BUTTON_SELECTOR)[0]
    if (tweetButton != null) {
      if (!undoButton) {
        attachEventHandler()
      }
    }
  }, DELAY_TIME_ATTACH_UNDO_BUTTON)
}

// Create an observer instance linked to the callback function
// Select the node that will be observed for mutations
const bodyNode = document.querySelector('body')
const observer = new MutationObserver(mutationObserverForTweetButton)
// Start observing the target node for configured mutations
observer.observe(bodyNode, { attributes: false, childList: true, subtree: true })
