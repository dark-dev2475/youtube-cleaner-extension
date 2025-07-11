# YouTube & Instagram Blocker Extension

A Chrome extension that helps you stay focused by blocking YouTube Shorts and Instagram feed content with manual toggle functionality.

## Features

- 🚫 **Block YouTube Shorts**: Hides Shorts videos, navigation links, and redirects from Shorts pages
- 📱 **Block Instagram Feed**: Hides main feed posts and suggested content
- ⚡ **Manual Toggle**: Easy on/off switch to control blocking functionality
- 🎨 **Beautiful UI**: Modern, gradient-based popup interface
- 🔄 **Real-time Updates**: Automatically applies blocking to new content as it loads

## Installation

### Method 1: Load as Unpacked Extension (Recommended for Development)

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension folder
5. The extension should now appear in your extensions list

### Method 2: Install from Chrome Web Store (When Available)

1. Visit the Chrome Web Store (link will be added when published)
2. Click "Add to Chrome"
3. Confirm the installation

## Usage

1. **Toggle the Extension**: Click the extension icon in your Chrome toolbar
2. **Enable/Disable Blocking**: Use the toggle switch in the popup
3. **Status Indicator**: The green/red dot shows if blocking is active
4. **Automatic Application**: Blocking is automatically applied to YouTube and Instagram pages

## How It Works

### YouTube Shorts Blocking
- Hides Shorts navigation links
- Removes Shorts videos from recommendations
- Blocks Shorts shelf in video pages
- Redirects from Shorts pages to YouTube homepage

### Instagram Feed Blocking
- Hides main feed posts
- Blocks suggested posts
- Replaces explore feed with blocked message
- Preserves stories and other non-feed content

## File Structure

```
youtube-cleaner-extension/
├── manifest.json          # Extension configuration
├── popup.html             # Popup interface
├── popup.js               # Popup functionality
├── background.js          # Background service worker
├── content.js             # Content blocking script
├── blocked.html           # Blocked content page
├── icons/                 # Extension icons
└── README.md              # This file
```

## Permissions

The extension requires the following permissions:
- `storage`: To save user preferences
- `activeTab`: To interact with current tab
- `scripting`: To inject content scripts
- `tabs`: To manage tab updates

## Development

To modify the extension:

1. Make your changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test your changes

## Troubleshooting

- **Extension not working**: Make sure it's enabled in `chrome://extensions/`
- **Content still showing**: Try refreshing the page or toggling the extension off and on
- **Permission errors**: Check that all required permissions are granted

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the MIT License.
