const fs = require('fs')
const path = require('path')
const got = require('got')
const { machineId, KEY_BINDS, windows, GAME_WINDOW } = require('../config')
const { register, unregisterAll } = require('electron-localshortcut')
/**
 * Save file to disk
 * @param {string} dest
 * @param {string} contents
 */
const saveFile = (dest, contents) => {
  try {
    fs.writeFileSync(dest, contents)
  } catch (e) {
    console.log('Error Saving Wheel Chair')
  }
}
/**
 * Download wheel chair extension
 */
const downloadWheelChair = async () => {
  try {
    let {
      body: chairloader
    } = await got.get('https://raw.githubusercontent.com/hrt/WheelChair/master/loader/chairloader.js')
    const {
      body: manifest
    } = await got.get('https://raw.githubusercontent.com/hrt/WheelChair/master/loader/manifest.json')
    chairloader = chairloader.replace(/(unique_string = ).*;/g, (_, v) => `${v}"${machineId}";`)
    saveFile(path.join(path.resolve(__dirname, '..', 'extensions'), 'chairloader.js'), chairloader)
    saveFile(path.join(path.resolve(__dirname, '..', 'extensions'), 'manifest.json'), manifest)
  } catch (e) {
    console.log(e)
  }
}
/**
 * Check wheel chair version and download if needed
 */
const checkWheelChairVersion = async () => {
  try {
    const versionFile = path.join(path.resolve(__dirname, '..', 'extensions'), 'version.txt')
    const {
      body
    } = await got.get('https://api.github.com/repos/hrt/WheelChair/releases', {
      json: true
    })
    const latestInfo = body[body.length - 1]
    const folderCheck = fs.existsSync(path.join(path.resolve(__dirname, '..', 'extensions'), 'version.txt'))
    if (folderCheck) {
      const localVersion = fs.readFileSync(versionFile, 'utf8')
      if (localVersion !== latestInfo.tag_name) {
        fs.writeFileSync(versionFile, latestInfo.tag_name)
        await downloadWheelChair()
      }
    } else {
      fs.writeFileSync(versionFile, latestInfo.tag_name)
      await downloadWheelChair()
    }
  } catch (e) {
    console.log(e)
    // TODO Handle error
  }
}
const initKeyBinds = () => {
  Object.keys(KEY_BINDS)
    .forEach(key => {
      register(windows[GAME_WINDOW], key, KEY_BINDS[key])
    })
}
const removeKeyBinds = () => {
  unregisterAll(windows[GAME_WINDOW])
}
module.exports = { checkWheelChairVersion, initKeyBinds, removeKeyBinds }
