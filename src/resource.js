const path = require('path')

const guideViewUrl = new URL(
  path.join(__dirname, '../app/index.html'),
  'file:'
)

const guideScriptPath = path.join(__dirname, '../app/script/main.js')
	
const loadViewUrl = new URL(
  path.join(__dirname, '../app/load.html'),
  'file:'
)

const loadScriptPath = path.join(__dirname, '../app/script/load.js')
	
const icoPath = path.join(__dirname, '../resource/icons/Rocket.Chat.ico')

const getGuideViewUrl = () => {
	return guideViewUrl.toString()
}

const getGuideScriptPath = () => {
	return guideScriptPath.toString()
}

const getLoadViewUrl = () => {
	return loadViewUrl.toString()
}

const getLoadScriptPath = () => {
	return loadScriptPath.toString()
}

const getIcoPath = () => {
	return icoPath.toString()
}

module.exports = {
	getGuideViewUrl,
	getGuideScriptPath,
	getLoadViewUrl,
	getLoadScriptPath,
	getIcoPath
}
