import browser from 'webextension-polyfill'

function openWebPage(url) {
  return browser.tabs.create({ url })
}

document.addEventListener('DOMContentLoaded', async () => {
  const tabs = await browser.tabs.query({
    active: true,
    lastFocusedWindow: true
  })

  const url = tabs.length && tabs[0].url

  const response = await browser.runtime.sendMessage({
    msg: 'hello',
    url
  })

  document.getElementById('link_github').addEventListener('click', () => {
    return openWebPage('https://github.com/lirantal/twiks')
  })

  document.getElementById('link_author').addEventListener('click', () => {
    return openWebPage('https://twitter.com/liran_tal')
  })

  document.getElementById('link_website').addEventListener('click', () => {
    return openWebPage('https://twiks.pro')
  })

  document.getElementById('button_website').addEventListener('click', () => {
    return openWebPage('https://twiks.pro')
  })

  document.getElementById('button_twikspro').addEventListener('click', () => {
    return openWebPage('https://twiks.pro')
  })

  const links = document.querySelectorAll('.unlock_with_pro')
  links.forEach(function (linkElement) {
    linkElement.addEventListener('click', () => {
      return openWebPage('https://twiks.pro')
    })
  })
})
