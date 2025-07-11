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
    
    function blockYouTubeShorts() {
        console.log('YouTube Shorts Blocker: Starting blocking...');
        
        // Function to block YouTube Shorts
        function blockShorts() {
            // 1. Block Shorts navigation links
            const shortsLinks = document.querySelectorAll('a[href="/shorts"], a[href*="/shorts/"]');
            shortsLinks.forEach(link => {
                link.style.display = 'none';
                link.style.visibility = 'hidden';
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
                    if (container) {
                        container.style.display = 'none';
                        container.style.visibility = 'hidden';
                    }
                });
            });
            
            // 3. Block Shorts shelf/reel shelf
            const shortsShelves = document.querySelectorAll('ytd-reel-shelf-renderer, ytd-rich-section-renderer[is-shorts]');
            shortsShelves.forEach(shelf => {
                shelf.style.display = 'none';
                shelf.style.visibility = 'hidden';
            });
            
            // 4. Block Shorts button in sidebar
            const shortsButtons = document.querySelectorAll('a[href="/shorts"], ytd-guide-entry-renderer a[href="/shorts"]');
            shortsButtons.forEach(button => {
                const listItem = button.closest('ytd-guide-entry-renderer');
                if (listItem) {
                    listItem.style.display = 'none';
                    listItem.style.visibility = 'hidden';
                }
            });
            
            // 5. Block Shorts in search results
            const searchResults = document.querySelectorAll('ytd-video-renderer, ytd-rich-item-renderer');
            searchResults.forEach(result => {
                const link = result.querySelector('a[href*="/shorts/"]');
                if (link) {
                    result.style.display = 'none';
                    result.style.visibility = 'hidden';
                }
            });
            
            // 6. Block Shorts in channel pages
            const channelVideos = document.querySelectorAll('ytd-grid-video-renderer, ytd-rich-item-renderer');
            channelVideos.forEach(video => {
                const link = video.querySelector('a[href*="/shorts/"]');
                if (link) {
                    video.style.display = 'none';
                    video.style.visibility = 'hidden';
                }
            });
            
            // 7. Block Shorts in recommendations
            const recommendations = document.querySelectorAll('ytd-rich-item-renderer');
            recommendations.forEach(item => {
                const link = item.querySelector('a[href*="/shorts/"]');
                if (link) {
                    item.style.display = 'none';
                    item.style.visibility = 'hidden';
                }
            });
            
            // 8. Block Shorts in trending
            const trendingItems = document.querySelectorAll('ytd-rich-grid-media');
            trendingItems.forEach(item => {
                const link = item.querySelector('a[href*="/shorts/"]');
                if (link) {
                    item.style.display = 'none';
                    item.style.visibility = 'hidden';
                }
            });
            
            // 9. Block Shorts in homepage feed
            const homeFeedItems = document.querySelectorAll('ytd-rich-item-renderer');
            homeFeedItems.forEach(item => {
                const link = item.querySelector('a[href*="/shorts/"]');
                if (link) {
                    item.style.display = 'none';
                    item.style.visibility = 'hidden';
                }
            });
            
            // 10. Block Shorts in mobile view
            const mobileItems = document.querySelectorAll('ytd-rich-grid-row');
            mobileItems.forEach(row => {
                const shortsInRow = row.querySelectorAll('a[href*="/shorts/"]');
                if (shortsInRow.length > 0) {
                    row.style.display = 'none';
                    row.style.visibility = 'hidden';
                }
            });
        }
        
        // Redirect from Shorts pages immediately
        if (window.location.pathname.includes('/shorts/')) {
            console.log('YouTube Shorts Blocker: Redirecting from Shorts page...');
            window.location.href = 'https://www.youtube.com/';
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