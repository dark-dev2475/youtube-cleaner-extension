// Content script for blocking YouTube Shorts and Instagram

(function() {
    'use strict';
    
    // Check if extension is enabled
    chrome.storage.local.get(['extensionEnabled'], function(result) {
        const isEnabled = result.extensionEnabled !== false; // Default to true
        if (isEnabled) {
            initializeBlocking();
        }
    });
    
    function initializeBlocking() {
        const currentUrl = window.location.href;
        
        if (currentUrl.includes('youtube.com')) {
            blockYouTubeShorts();
        } else if (currentUrl.includes('instagram.com')) {
            blockInstagramFeed();
        }
    }
    
    // Function to create and show notification
    function showNotification(message, type = 'info') {
        // Remove existing notification if any
        const existingNotification = document.getElementById('youtube-shorts-blocker-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.id = 'youtube-shorts-blocker-notification';
        notification.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 999999;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            text-align: center;
            font-family: 'YouTube Sans', 'Roboto', Arial, sans-serif;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            animation: slideDown 0.3s ease-out;
        `;
        
        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from { transform: translateY(-100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(0); opacity: 1; }
                to { transform: translateY(-100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        // Create icon
        const icon = document.createElement('span');
        icon.innerHTML = type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '🚫';
        icon.style.fontSize = '16px';
        
        // Create message
        const messageElement = document.createElement('span');
        messageElement.textContent = message;
        
        // Create close button
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '✕';
        closeButton.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
            padding: 0;
            margin-left: 15px;
            opacity: 0.8;
            transition: opacity 0.2s;
        `;
        closeButton.onmouseover = () => closeButton.style.opacity = '1';
        closeButton.onmouseout = () => closeButton.style.opacity = '0.8';
        closeButton.onclick = () => {
            notification.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        };
        
        // Assemble notification
        notification.appendChild(icon);
        notification.appendChild(messageElement);
        notification.appendChild(closeButton);
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideUp 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
        
        return notification;
    }
    
    function blockYouTubeShorts() {
        console.log('YouTube Shorts Blocker: Starting blocking...');
        
        // Show initial notification
        showNotification('YouTube Shorts Blocker is now active! 🚫', 'success');
        
        // Function to block YouTube Shorts
        function blockShorts() {
            let blockedCount = 0;
            
            // 1. Block Shorts navigation links
            const shortsLinks = document.querySelectorAll('a[href="/shorts"], a[href*="/shorts/"]');
            shortsLinks.forEach(link => {
                if (link.style.display !== 'none') {
                    link.style.display = 'none';
                    link.style.visibility = 'hidden';
                    blockedCount++;
                }
            });
            
            // 2. Block Shorts videos in feed with multiple selectors
            const shortsSelectors = [
                'a[href*="/shorts/"]',
                'ytd-rich-item-renderer a[href*="/shorts/"]',
                'ytd-video-renderer a[href*="/shorts/"]',
                'ytd-compact-video-renderer a[href*="/shorts/"]',
                'ytd-grid-video-renderer a[href*="/shorts/"]',
                'ytd-rich-grid-media a[href*="/shorts/"]'
            ];
            
            shortsSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    const container = element.closest('ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer, ytd-rich-grid-media');
                    if (container && container.style.display !== 'none') {
                        container.style.display = 'none';
                        container.style.visibility = 'hidden';
                        blockedCount++;
                    }
                });
            });
            
            // 3. Block Shorts shelf/reel shelf
            const shortsShelves = document.querySelectorAll('ytd-reel-shelf-renderer, ytd-rich-section-renderer[is-shorts]');
            shortsShelves.forEach(shelf => {
                if (shelf.style.display !== 'none') {
                    shelf.style.display = 'none';
                    shelf.style.visibility = 'hidden';
                    blockedCount++;
                }
            });
            
            // 4. Block Shorts button in sidebar
            const shortsButtons = document.querySelectorAll('a[href="/shorts"], ytd-guide-entry-renderer a[href="/shorts"]');
            shortsButtons.forEach(button => {
                const listItem = button.closest('ytd-guide-entry-renderer');
                if (listItem && listItem.style.display !== 'none') {
                    listItem.style.display = 'none';
                    listItem.style.visibility = 'hidden';
                    blockedCount++;
                }
            });
            
            // 5. Block Shorts in search results
            const searchResults = document.querySelectorAll('ytd-video-renderer, ytd-rich-item-renderer');
            searchResults.forEach(result => {
                const link = result.querySelector('a[href*="/shorts/"]');
                if (link && result.style.display !== 'none') {
                    result.style.display = 'none';
                    result.style.visibility = 'hidden';
                    blockedCount++;
                }
            });
            
            // 6. Block Shorts in channel pages
            const channelVideos = document.querySelectorAll('ytd-grid-video-renderer, ytd-rich-item-renderer');
            channelVideos.forEach(video => {
                const link = video.querySelector('a[href*="/shorts/"]');
                if (link && video.style.display !== 'none') {
                    video.style.display = 'none';
                    video.style.visibility = 'hidden';
                    blockedCount++;
                }
            });
            
            // 7. Block Shorts in recommendations
            const recommendations = document.querySelectorAll('ytd-rich-item-renderer');
            recommendations.forEach(item => {
                const link = item.querySelector('a[href*="/shorts/"]');
                if (link && item.style.display !== 'none') {
                    item.style.display = 'none';
                    item.style.visibility = 'hidden';
                    blockedCount++;
                }
            });
            
            // 8. Block Shorts in trending
            const trendingItems = document.querySelectorAll('ytd-rich-grid-media');
            trendingItems.forEach(item => {
                const link = item.querySelector('a[href*="/shorts/"]');
                if (link && item.style.display !== 'none') {
                    item.style.display = 'none';
                    item.style.visibility = 'hidden';
                    blockedCount++;
                }
            });
            
            // 9. Block Shorts in homepage feed
            const homeFeedItems = document.querySelectorAll('ytd-rich-item-renderer');
            homeFeedItems.forEach(item => {
                const link = item.querySelector('a[href*="/shorts/"]');
                if (link && item.style.display !== 'none') {
                    item.style.display = 'none';
                    item.style.visibility = 'hidden';
                    blockedCount++;
                }
            });
            
            // 10. Block Shorts in mobile view
            const mobileItems = document.querySelectorAll('ytd-rich-grid-row');
            mobileItems.forEach(row => {
                const shortsInRow = row.querySelectorAll('a[href*="/shorts/"]');
                if (shortsInRow.length > 0 && row.style.display !== 'none') {
                    row.style.display = 'none';
                    row.style.visibility = 'hidden';
                    blockedCount++;
                }
            });
            
            // Show notification if content was blocked
            if (blockedCount > 0) {
                showNotification(`Blocked ${blockedCount} YouTube Shorts content! 🚫`, 'warning');
            }
        }
        
        // Handle Shorts pages with notification instead of redirect
        if (window.location.pathname.includes('/shorts/')) {
            console.log('YouTube Shorts Blocker: On Shorts page, showing notification...');
            showNotification('YouTube Shorts are blocked! Redirecting to homepage...', 'warning');
            
            // Replace page content with a message
            document.body.innerHTML = `
                <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    font-family: 'YouTube Sans', 'Roboto', Arial, sans-serif;
                    text-align: center;
                    padding: 20px;
                ">
                    <div style="font-size: 48px; margin-bottom: 20px;">🚫</div>
                    <h1 style="font-size: 32px; margin-bottom: 15px;">YouTube Shorts Blocked</h1>
                    <p style="font-size: 18px; margin-bottom: 30px; opacity: 0.9;">
                        This content has been blocked by the YouTube & Instagram Blocker extension.
                    </p>
                    <button onclick="window.location.href='https://www.youtube.com/'" style="
                        background: white;
                        color: #667eea;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 8px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: transform 0.2s;
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        Go to YouTube Homepage
                    </button>
                </div>
            `;
            return;
        }
        
        // Run blocking immediately
        blockShorts();
        
        // Set up observer for dynamic content with debouncing
        let timeout;
        const observer = new MutationObserver(function(mutations) {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        blockShorts();
                    }
                });
            }, 100);
        });
        
        // Start observing with more specific options
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
        
        // Also run blocking periodically to catch any missed content
        setInterval(blockShorts, 2000);
        
        console.log('YouTube Shorts Blocker: Blocking active');
    }
    
    function blockInstagramFeed() {
        // Function to block Instagram feed
        function blockFeed() {
            // Block main feed posts
            const feedPosts = document.querySelectorAll('article');
            feedPosts.forEach(post => {
                // Check if it's a feed post (not stories or other content)
                const isFeedPost = post.querySelector('div[role="button"]') && 
                                 !post.closest('[role="dialog"]') &&
                                 !post.closest('[data-testid="stories-container"]');
                
                if (isFeedPost) {
                    post.style.display = 'none';
                }
            });
            
            // Block suggested posts
            const suggestedPosts = document.querySelectorAll('div[data-testid="suggested-post"]');
            suggestedPosts.forEach(post => {
                post.style.display = 'none';
            });
            
            // Block explore feed
            if (window.location.pathname === '/explore/') {
                const exploreGrid = document.querySelector('main');
                if (exploreGrid) {
                    exploreGrid.innerHTML = `
                        <div style="text-align: center; padding: 50px; color: #666;">
                            <h2>Explore Feed Blocked</h2>
                            <p>This content has been blocked by the YouTube & Instagram Blocker extension.</p>
                        </div>
                    `;
                }
            }
        }
        
        // Run immediately
        blockFeed();
        
        // Set up observer for dynamic content
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    blockFeed();
                }
            });
        });
        
        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Listen for messages from background script
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'updateBlockingState') {
            if (request.enabled) {
                initializeBlocking();
            } else {
                // Remove blocking by reloading the page
                window.location.reload();
            }
        }
    });
    
})(); 