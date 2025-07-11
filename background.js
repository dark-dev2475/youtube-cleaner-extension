// Background script for YouTube & Instagram Blocker

// Initialize extension state
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({ extensionEnabled: true });
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'updateBlockingState') {
        handleBlockingStateUpdate(request.enabled);
    }
});

// Handle tab updates
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url) {
        checkAndBlockContent(tabId, tab.url);
    }
});

// Handle blocking state updates
function handleBlockingStateUpdate(enabled) {
    // Update all YouTube and Instagram tabs
    chrome.tabs.query({
        url: ["*://*.youtube.com/*", "*://*.instagram.com/*"]
    }, function(tabs) {
        tabs.forEach(function(tab) {
            if (enabled) {
                // Inject content script to block content
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['content.js']
                });
            } else {
                // Reload tab to remove blocking
                chrome.tabs.reload(tab.id);
            }
        });
    });
}

// Check and block content for new tabs
function checkAndBlockContent(tabId, url) {
    if (url.includes('youtube.com') || url.includes('instagram.com')) {
        chrome.storage.local.get(['extensionEnabled'], function(result) {
            const isEnabled = result.extensionEnabled !== false; // Default to true
            if (isEnabled) {
                // Small delay to ensure page is fully loaded
                setTimeout(function() {
                    chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        files: ['content.js']
                    });
                }, 1000);
            }
        });
    }
}

// Handle extension icon click
chrome.action.onClicked.addListener(function(tab) {
    // This will open the popup automatically due to manifest configuration
}); 