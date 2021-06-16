
const isMac = () => {
	return process.platform === 'darwin'
}

const isWin = () => {
	return process.platform == 'win32'
}

module.exports = {
	isMac,
	isWin
}
