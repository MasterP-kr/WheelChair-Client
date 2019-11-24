'use strict'
const { app } = require('electron')
const unhandled = require('electron-unhandled')
const { is } = require('electron-util')
const fs = require('fs')
const path = require('path')
const { windows, UPDATE_WINDOW } = require('./config')
const createUpdateWindow = require('./windows/update')
const { checkWheelChairVersion } = require('./Utils')
const { unregisterAll } = require('electron-localshortcut')
unhandled()
// checks if extension folder is created
// if not create

try {
  if (!fs.existsSync(path.join(__dirname, '..\\extensions'))) {
    fs.mkdirSync(path.join(__dirname, '..\\extensions'))
  }
} catch (e) {
  console.error(e)
}

app.commandLine.appendSwitch('disable-frame-rate-limit')
app.commandLine.appendSwitch('enable-quic')
app.commandLine.appendSwitch('high-dpi-support', 1)
app.commandLine.appendSwitch('ignore-gpu-blacklist')

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
  app.quit()
}

app.on('second-instance', () => {
  if (windows[UPDATE_WINDOW]) {
    if (windows[UPDATE_WINDOW].isMinimized()) {
      windows[UPDATE_WINDOW].restore()
    }
    windows[UPDATE_WINDOW].show()
  }
})

app.on('window-all-closed', () => {
  if (!is.macos) {
    app.quit()
  }
})

app.on('activate', async () => {
  if (!windows[UPDATE_WINDOW]) {
    windows[UPDATE_WINDOW] = await createUpdateWindow()
  }
})
app.once('before-quit', () => {
  unregisterAll()
  windows[UPDATE_WINDOW].close()
});
(async () => {
  await checkWheelChairVersion()
  await app.whenReady()
  windows[UPDATE_WINDOW] = await createUpdateWindow()
})()
