
const hook = require('./hook')
const { ipcRenderer } = require('electron')

function loadInitData(cb) {
  ipcRenderer.once('loadInitData-reply', (_, arg) => {
    cb(arg)
  })
  ipcRenderer.send('loadInitData')
}

function clickGoToRcWebHandler() {
  const connectTextEl = document.getElementById('connect-text')
  const connectLoadingEl = document.getElementById('connect-loading')
  connectTextEl.style.display = 'none'
  connectLoadingEl.style.display = 'inline-block'
  ipcRenderer.send('guideGoToRcWebEvent', document.getElementById('i-url').value)
  let t = setTimeout(() => {
    ipcRenderer.removeAllListeners()
    connectTextEl.style.display = 'inline-block'
    connectLoadingEl.style.display = 'none'
  }, 10000)
  ipcRenderer.once('guideGoToRcWebEvent-reply', () => {
    connectTextEl.style.display = 'inline-block'
    connectLoadingEl.style.display = 'none'
    clearTimeout(t)
    t = null
  })
}

// use websocket hook to notify user
// standard (messageEvent, url, wsObject)
hook.getWsHook().after = (messageEvent) => {
  try {
    const tmp = messageEvent.data.match(/a\[(\S*)\]/)[1]
    const body = JSON.parse(JSON.parse(tmp))
    if (body.collection === 'stream-notify-user') {
      if (body.fields && body.fields.args && body.fields.args[1] && body.fields.args[1].alert) {
        ipcRenderer.send('revNewMessageEvent')
      }
    }
  } catch (e) {
    console.log(e)
  }
  return messageEvent;
}

global.loadInitData = loadInitData
global.clickGoToRcWebHandler = clickGoToRcWebHandler
