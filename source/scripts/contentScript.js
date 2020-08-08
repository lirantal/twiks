var s = document.createElement('script');
s.src = chrome.runtime.getURL('js/injected.bundle.js');
s.onload = function() {
  this.remove();
};
(document.head || document.documentElement).appendChild(s);