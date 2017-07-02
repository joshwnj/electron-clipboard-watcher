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

*/
module.exports = function (opts) {
  opts = opts || {}
  const watchDelay = opts.watchDelay || 1000
  const callOnlyAny = opts.callOnlyAny || false;
  let lastText = clipboard.readText()
  let lastImage = clipboard.readImage()

  const intervalId = setInterval(() => {
    let lastVal;
    let hasDiff = false;
    const text = clipboard.readText()
    const image = clipboard.readImage()

    if (opts.onImageChange && hasDiff == false && imageHasDiff(image, lastImage)) {
      lastImage = image
      lastVal = image
      hasDiff = true
      if(!(opts.onAnyChange && callOnlyAny)){
        opts.onImageChange(image)
      }
    }

    if (opts.onTextChange && hasDiff == false && textHasDiff(text, lastText)) {
      lastText = text
      lastVal = text
      hasDiff = true
      if(!(opts.onAnyChange && callOnlyAny)){
        opts.onTextChange(image)
      }
    }

    if(opts.onAnyChange && lastVal != null && hasDiff){
      return opts.onAnyChange(lastVal)
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
