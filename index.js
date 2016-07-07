'use strict'

const electron = require('electron')
const clipboard = electron.clipboard

/*

Start polling the clipboard for changes.

Usage:

```
const clipboardWatcher = require('electron-clipboard-watcher')
clipboardWatcher({
  // (optional) delay in ms between polls
  watchDelay: 1000,

  // handler for when image data is copied into the clipboard
  onImageChange: function (nativeImage) { ... },

  // handler for when text data is copied into the clipboard
  onTextChange: function (text) { ... }
})
```

The `clipboardWatcher` function returns an object with a `stop()`
function which you can use to deactivate the polling:

```
const watcher = clipboardWatcher({ ... })
watcher.stop()
```

*/
module.exports = function (opts) {
  opts = opts || {}
  const watchDelay = opts.watchDelay || 1000

  let lastText = clipboard.readText()
  let lastImage = clipboard.readImage()

  const intervalId = setInterval(() => {
    const text = clipboard.readText()
    const image = clipboard.readImage()

    if (opts.onImageChange && imageHasDiff(image, lastImage)) {
      lastImage = image
      return opts.onImageChange(image)
    }

    if (opts.onTextChange && textHasDiff(text, lastText)) {
      lastText = text
      return opts.onTextChange(text)
    }
  }, watchDelay)

  return {
    stop: () => clearInterval(intervalId)
  }
}

/*

Tell if there is any difference between 2 images

*/
function imageHasDiff (a, b) {
  return !a.isEmpty() && b.toDataURL() !== a.toDataURL()
}

/*

Tell if there is any difference between 2 strings

*/
function textHasDiff (a, b) {
  return a && b !== a
}
