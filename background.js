let on = false;

chrome.storage.sync.set({
  furiganaOff: false
});

setBadgeText();

chrome.tabs.onActivated.addListener(function(activeInfo) {
  applyStylesheetToTab(activeInfo.tabId);
});

chrome.tabs.onUpdated.addListener(function(activeInfo) {
  applyStylesheetToTab(activeInfo.tabId);
});

chrome.storage.onChanged.addListener(function(changes) {
  if ('furiganaOff' in changes && changes.furiganaOff.newValue === false) {
    applyStylesheetToAllTabs();
  }
});

chrome.browserAction.onClicked.addListener(function() {
  on = !on;

  setBadgeText();

  if (on) {
    applyStylesheetToTab(undefined);
  }
});

function setBadgeText() {
  chrome.storage.sync.set({'furiganaOff': on});
  const badgeText = on ? 'ON' : '';
  chrome.browserAction.setBadgeText({text: badgeText});
}

function applyStylesheetToAllTabs() {
  chrome.tabs.getAllInWindow(null, function(tabs) {
    tabs.forEach(function(tab) {
      applyStylesheetToTab(tab.id);
    });
  });
}

function applyStylesheetToTab(id) {
  chrome.tabs.executeScript(id, {
    file: 'content.js'
  }, function() {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError.message);
    }
  });
}
