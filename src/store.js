
const store = new (require('electron-store'))()

const saveWsAccessUrl = (url) => {
	store.set('ws:access:url', url)
}

const getWsAccessUrl = () => {
	return store.get('ws:access:url')
}

const clearWsAccessUrl = () => {
	store.delete('ws:access:url')
}

const saveWindowSize = (w, h) => {
	store.set('window:size', JSON.stringify({w: w, h: h}))
}

const getWindowSize = () => {
	const size = store.get('window:size')
	return size ? JSON.parse(size) : null
}

module.exports = {
	saveWsAccessUrl,
	getWsAccessUrl,
	clearWsAccessUrl,
	saveWindowSize,
	getWindowSize
}
