
const { ipcRenderer } = require('electron')

function clickCancelHandler() {
	ipcRenderer.send('loadingCancelEvent')
}

global.clickCancelHandler = clickCancelHandler
