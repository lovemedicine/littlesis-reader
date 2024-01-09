# littlesis-reader

A prototype (in progress) for a Chrome extension that inserts links to [LittleSis](https://littlesis.org) entities mentioned on web pages. If you are planning to use this heavily, notify [@lovemedicine](https://github.com/lovemedicine) since the entity search uses a privately run Amazon CloudSearch instance for the time being.

### Requirements

- Node.js
- Chrome browser
- OpenAI API key

### Instructions

1. Copy `src/config.example.js` to `src/config.js`.

2. Set `openaiApiKey` in `src/config.js`. Also set `openaiModel` and `openaiMaxTokens` to suitable values depending on which models your API key allows you to use.

3. Edit the `manifest.json` and enter a suitable value for `content_scripts.matches`, which will determine which web pages this extension will operate on.

4. Run `npm run start` to build your extension package into the `dist` folder.

5. Open `chrome://extensions/` in Chrome, click on "Load Unpacked", and select the `dist` folder.

6. Enable the `littlesis-reader` extension.

7. If you make edits to the `src` code, the `dist` package will rebuild automatically, but you'll need to click on the refresh icon next to `littlesis-reader` on the `chrome://extensions/` page.

### Available Commands

| Commands        | Description                         |
| --------------- | ----------------------------------- |
| `npm run start` | build extension, watch file changes |
| `npm run build` | generate release version            |
| `npm run docs`  | generate source code docs           |
| `npm run clean` | remove temporary files              |
| `npm run test`  | run unit tests                      |
| `npm run sync`  | update config files                 |

For CLI instructions see [User Guide &rarr;](https://oss.mobilefirst.me/extension-cli/)

### Learn More

**Extension Developer guides**

- [Getting started with extension development](https://developer.chrome.com/extensions/getstarted)
- Manifest configuration: [version 2](https://developer.chrome.com/extensions/manifest) - [version 3](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Permissions reference](https://developer.chrome.com/extensions/declare_permissions)
- [Chrome API reference](https://developer.chrome.com/docs/extensions/reference/)

**Extension Publishing Guides**

- [Publishing for Chrome](https://developer.chrome.com/webstore/publish)
- [Publishing for Edge](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/publish/publish-extension)
- [Publishing for Opera addons](https://dev.opera.com/extensions/publishing-guidelines/)
- [Publishing for Firefox](https://extensionworkshop.com/documentation/publish/submitting-an-add-on/)
