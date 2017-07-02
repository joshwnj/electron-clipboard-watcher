# electron-clipboard-watcher

Poll the system clipboard for changing text or image data.

## Install

`npm install --save electron-clipboard-watcher`

## Usage

Start polling the clipboard for changes.

Usage:

```
const clipboardWatcher = require('electron-clipboard-watcher')
clipboardWatcher({
  // (optional) delay in ms between polls
  watchDelay: 1000,

  // (optional) limit callbacks to only onAnyChange, default is false
  callOnlyAny : true,

  // handler for when image data is copied into the clipboard
  onImageChange: function (nativeImage) { ... },

  // handler for when text data is copied into the clipboard
  onTextChange: function (text) { ... }

  // handler for when any data is copied into the clipboard
  onAnyChange: function (text) { ... }
})
```

The `clipboardWatcher` function returns an object with a `stop()`
function which you can use to deactivate the polling:

```
const watcher = clipboardWatcher({ ... })
watcher.stop()
```

## License

MIT
