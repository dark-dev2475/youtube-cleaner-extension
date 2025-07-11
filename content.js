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
        // Function to block YouTube Shorts
        function blockShorts() {
            // Block Shorts from navigation
            const shortsLinks = document.querySelectorAll('a[href="/shorts"], a[href*="/shorts/"]');
            shortsLinks.forEach(link => {
                link.style.display = 'none';
            });
            
            // Block Shorts videos in feed
            const shortsVideos = document.querySelectorAll('a[href*="/shorts/"]');
            shortsVideos.forEach(video => {
                const container = video.closest('ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer');
                if (container) {
                    container.style.display = 'none';
                }
            });
            
            // Block Shorts shelf
            const shortsShelf = document.querySelector('ytd-reel-shelf-renderer');
            if (shortsShelf) {
                shortsShelf.style.display = 'none';
            }
            
            // Block Shorts button in sidebar
            const shortsButton = document.querySelector('a[href="/shorts"]');
            if (shortsButton) {
                const listItem = shortsButton.closest('ytd-guide-entry-renderer');
                if (listItem) {
                    listItem.style.display = 'none';
                }
            }
            
            // Redirect from Shorts pages
            if (window.location.pathname.includes('/shorts/')) {
                window.location.href = 'https://www.youtube.com/';
            }
        }
        
        // Run immediately
        blockShorts();
        
        // Set up observer for dynamic content
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    blockShorts();
                }
            });
        });
        
        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
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