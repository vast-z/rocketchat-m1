
const store = new (require('electron-store'))()

const saveWorkspace = (ws) => {
	store.set('workspace', ws)
}

const getWorkspace = () => {
	return store.get('workspace') 
}

const clearWorkspace = () => {
	store.delete('ws:access:url')
}

const saveWindowSize = (w, h) => {
	store.set('window:size', {w: w, h: h})
}

const getWindowSize = () => {
	return store.get('window:size')
}

module.exports = {
	saveWorkspace,
	getWorkspace,
	clearWorkspace,
	saveWindowSize,
	getWindowSize
}
