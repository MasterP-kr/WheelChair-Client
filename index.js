'use strict';
const path = require('path');
const {
	app,
	BrowserWindow
} = require('electron');
const {
	autoUpdater
} = require('electron-updater');
const {
	is
} = require('electron-util');
const unhandled = require('electron-unhandled');
const debug = require('electron-debug');
const contextMenu = require('electron-context-menu');
const config = require('./config');
const packageJson = require('./package.json');
const hotkeys = require('electron-localshortcut')

unhandled();
debug();
contextMenu();

app.setAppUserModelId(packageJson.build.appId);

if (!is.development) {
	const FOUR_HOURS = 1000 * 60 * 60 * 4;
	setInterval(() => {
		autoUpdater.checkForUpdates();
	}, FOUR_HOURS);

	autoUpdater.checkForUpdates();
}

// Prevent window from being garbage collected
let mainWindow;

app.commandLine.appendSwitch('disable-frame-rate-limit');
app.commandLine.appendSwitch('enable-quic');
app.commandLine.appendSwitch('high-dpi-support', 1);
app.commandLine.appendSwitch('ignore-gpu-blacklist');



const createMainWindow = async () => {
	BrowserWindow.addExtension(path.join(__dirname, '\\extensions'))
	const win = new BrowserWindow({
		title: app.getName(),
		show: false,
		width: 600,
		height: 400,
		webPreferences: {
			nodeIntegration: false,
			webSecurity: true,
			preload: path.join(__dirname, 'preload.js')
		}
	});

	win.on('ready-to-show', () => {
		win.show();
	});

	win.on('closed', () => {
		// Dereference the window
		// For multiple windows store them in an array
		mainWindow = undefined;
	});

	await win.loadURL("https://krunker.io");

	return win;
};

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
	app.quit();
}

app.on('second-instance', () => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}

		mainWindow.show();
	}
});

app.on('window-all-closed', () => {
	if (!is.macos) {
		app.quit();
	}
});

app.on('activate', async () => {
	if (!mainWindow) {
		mainWindow = await createMainWindow();
	}
});

(async () => {
	await app.whenReady();
	mainWindow = await createMainWindow();
})();
