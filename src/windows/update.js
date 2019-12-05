const path = require('path')

const { BrowserWindow, ipcMain } = require('electron')
const { windows, UPDATE_WINDOW, GAME_WINDOW } = require('../config')

const createGameWindow = require('./game')
const { initKeyBinds } = require('../Utils')
/**
 * Create client update window
 */
module.exports = async () => {
  const win = new BrowserWindow({
    width: 550,
    height: 550,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: true
    }
  })
  win.setMenu(null)

  win.loadFile(path.join(path.resolve(__dirname, '..'), 'index.html'))

  win.webContents.openDevTools({ mode: 'undocked' })
  win.on('ready-to-show', () => {
    win.show()
  })
  win.on('closed', async () => {
    windows[UPDATE_WINDOW] = undefined
  })
  ipcMain.on('start-game', async function (event, arg) {
    windows[GAME_WINDOW] = await createGameWindow()
    initKeyBinds()
  })

  return win
}
