'use strict'
const Store = require('electron-store')
const { clipboard, app } = require('electron')
const { machineIdSync } = require('node-machine-id')
// used for wheel chair extesion
const machineId = machineIdSync()

// BrowserWindows
const UPDATE_WINDOW = 0
const GAME_WINDOW = 1
const windows = []

// Regex to test for valid game url
const URL_REGEX = /^(https?:\/\/)?(www\.)?(.+)krunker\.io(|\/|\/\?game=.+)$/
// Init store
const store = new Store({
  defaults: {
    isFullScreen: false
  }
})

// Setup keybinds for client
const KEY_BINDS = {
  F5: () => {
    windows[GAME_WINDOW].webContents.reloadIgnoringCache()
  },
  F11: () => {
    const full = !windows[GAME_WINDOW].isFullScreen()
    windows[GAME_WINDOW].setFullScreen(full)
    store.set('isFullScreen', full)
  },
  F12: () => {
    windows[GAME_WINDOW].openDevTools()
  },
  Esc: () => {
    windows[GAME_WINDOW].webContents.executeJavaScript('document.exitPointerLock()')
    windows[GAME_WINDOW].webContents.send('esc')
  },

  'Alt+F4': () => {
    app.quit()
  },
  'Ctrl+C': () => {
    const gameUrl = windows[GAME_WINDOW].webContents.getURL()
    if (URL_REGEX.test(gameUrl)) {
      clipboard.writeText(gameUrl)
    }
  },
  'Command+C': () => {
    const gameUrl = windows[GAME_WINDOW].webContents.getURL()
    if (URL_REGEX.test(gameUrl)) {
      clipboard.writeText(gameUrl)
    }
  },
  'Command+V': () => {
    const gameUrl = clipboard.readText()
    if (URL_REGEX.test(gameUrl)) {
      windows[GAME_WINDOW].openURL(gameUrl)
    }
  },
  'Ctrl+V': () => {
    const gameUrl = clipboard.readText()
    if (URL_REGEX.test(gameUrl)) {
      windows[GAME_WINDOW].openURL(gameUrl)
    }
  }
}

module.exports = {
  UPDATE_WINDOW,
  GAME_WINDOW,
  KEY_BINDS,
  windows,
  machineId,
  store
}
