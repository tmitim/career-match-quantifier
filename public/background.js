/*global chrome*/
chrome.tabs.onUpdated.addListener(
  function (tabId, changeInfo, tab) {
    // read changeInfo data and do something with it
    // like send the new url to contentscripts.js
    if (changeInfo.url) {
      console.log('xxxxx')
      chrome.tabs.sendMessage(tabId, {
        message: 'hello!',
        url: changeInfo.url
      })
    }
  }
);

console.log('xxxxx outside')
