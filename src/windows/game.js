const path = require('path')

const { BrowserWindow } = require('electron')
const { windows, UPDATE_WINDOW, GAME_WINDOW, store } = require('../config')
/**
 * Create browser window for krunker.io
 */
module.exports = async () => {
  // load wheel chair extension
  BrowserWindow.addExtension(path.join(path.resolve(__dirname, '..'), 'extensions'))
  const win = new BrowserWindow({
    show: false,
    darkTheme: true,
    fullscreen: store.get('isFullScreen', false),
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      webSecurity: true,
      preload: path.join(path.resolve(__dirname, '..'), 'preload.js')
    }
  })
  win.setMenu(null)
  win.removeMenu()
  win.loadURL('https://krunker.io')

  win.on('ready-to-show', () => {
    if (windows[UPDATE_WINDOW])windows[UPDATE_WINDOW].close()
    win.show()
  })

  win.on('closed', () => {
    // Dereference the window
    windows[GAME_WINDOW] = undefined
  })

  return win
}
