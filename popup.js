document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('toggleSwitch');
    const statusDot = document.getElementById('statusDot');
    
    // Load current state when popup opens
    loadCurrentState();
    
    // Add event listener for toggle switch
    toggleSwitch.addEventListener('change', function() {
        const isEnabled = toggleSwitch.checked;
        updateExtensionState(isEnabled);
    });
    
    function loadCurrentState() {
        chrome.storage.local.get(['extensionEnabled'], function(result) {
            const isEnabled = result.extensionEnabled !== false; // Default to true
            toggleSwitch.checked = isEnabled;
            updateStatusDisplay(isEnabled);
        });
    }
    
    function updateExtensionState(isEnabled) {
        // Save state to storage
        chrome.storage.local.set({ extensionEnabled: isEnabled }, function() {
            updateStatusDisplay(isEnabled);
            
            // Send message to background script to update blocking state
            chrome.runtime.sendMessage({
                action: 'updateBlockingState',
                enabled: isEnabled
            });
            
            // Update current tab if it's YouTube or Instagram
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                if (tabs[0]) {
                    const url = tabs[0].url;
                    if (url && (url.includes('youtube.com') || url.includes('instagram.com'))) {
                        chrome.tabs.reload(tabs[0].id);
                    }
                }
            });
        });
    }
    
    function updateStatusDisplay(isEnabled) {
        if (isEnabled) {
            statusDot.className = 'status-dot active';
        } else {
            statusDot.className = 'status-dot inactive';
        }
    }
}); 