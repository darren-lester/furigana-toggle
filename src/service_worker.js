chrome.storage.sync.get({ furiganaOff: false }, (items) => {
  setBadgeText(items.furiganaOff);
  applyStylesheetToAllTabs();
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
  applyStylesheetToTab(activeInfo.tabId);
  setActiveTabPopup();
});

chrome.tabs.onUpdated.addListener(function (tabId) {
  applyStylesheetToTab(tabId);
  setActiveTabPopup();
});

chrome.action.onClicked.addListener(function () {
  chrome.storage.sync.get({ furiganaOff: false }, (items) => {
    chrome.storage.sync.set({ furiganaOff: !items.furiganaOff });
  });
});

chrome.storage.onChanged.addListener(function (changes) {
  if (!("furiganaOff" in changes)) {
    return;
  }

  applyStylesheetToAllTabs();
  setBadgeText(changes.furiganaOff.newValue);
});

function setBadgeText(on) {
  chrome.action.setBadgeText({
    text: on ? "ON" : "",
  });
}

function applyStylesheetToAllTabs() {
  chrome.tabs.query({ currentWindow: true }, function (tabs) {
    tabs.forEach(function (tab) {
      applyStylesheetToTab(tab.id);
    });
  });
}

function applyStylesheetToTab(tabId) {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ["content.js"],
  });
}

function applyToActiveTab() {
  (async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    applyStylesheetToTab(tab.id);
  })();
}

function setActiveTabPopup() {
  (async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });

    const hasRuby = await chrome.tabs.sendMessage(tab.id, {
      action: "CHECK_HAS_RUBY",
    });

    chrome.action.setPopup({
      popup: hasRuby ? "" : "popup/no-ruby-popup.html",
    });
  })();
}
