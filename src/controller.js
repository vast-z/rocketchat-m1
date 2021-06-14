
const { app, ipcMain, BrowserWindow, dialog } = require('electron')
const got = require('got')
const urljoin = require('url-join')
const validUrl = require('valid-url')
const store = require('./store')
const resource = require('./resource')

let badgeShow = false

const preLoadPage = (win, url, errJump) => {
  const { x, y, width, height } = win.getContentBounds()
  let loading = new BrowserWindow({
    parent: win,
    x: x,
    y: y,
    width: width,
    height: height,
    show: false,
    frame: false,
    backgroundColor: '#2f343d',
    resizable: false,
    webPreferences: {
      preload: resource.getLoadScriptPath(),
      // close isolation to preload js
      contextIsolation: false,
    },
  })
  ipcMain.once('loadingCancelEvent', () => {
    errJump(win)
  })
  loading.once('show', () => {
    // TODO win cause err，return
    win.webContents.once('dom-ready', () => {
      win.show()
      loading.hide()
      loading.close()
      loading = null
      store.saveWsAccessUrl(url.toString())
    })
    // long loading html
    win.loadURL(url.toString())
  })
  loading.loadURL(resource.getLoadViewUrl())
  loading.show()
}

const loadPage = (win, url) => {
  win.loadURL(url.toString())
}

const jumpToGuidePage = (win) => {
  if (!win) {
    win = BrowserWindow.getFocusedWindow()
  }
  loadPage(win, resource.getGuideViewUrl())
}

const logout = () => {
  store.clearWsAccessUrl()
}

const initPage = (win) => {
  const url = store.getWsAccessUrl()
  if (url) {
    preLoadPage(win, url, jumpToGuidePage)
  } else {
    jumpToGuidePage(win)
  }
}

function setBadgeStatus(show) {
  const temp = Boolean(show)
  if (badgeShow === temp) {
    return
  }
  if (!temp) {
    app.dock.setBadge('')
  }
  badgeShow = temp
}

ipcMain.on('guideGoToRcWebEvent', async (event, arg) => {
  if (validUrl.isUri(arg)) {
    const apiInfoUrl = urljoin(arg, '/api/info')
    got(apiInfoUrl.toString()).json().then(res => {
      if (res.version) {
        const win = BrowserWindow.getFocusedWindow()
        preLoadPage(win, arg, jumpToGuidePage)
      } else {
        dialog.showErrorBox("Error", "Please enter correct url")
      }
    }).catch(e => {
      console.debug(e)
      dialog.showErrorBox("Error", "Please retry, use correct rocket url")
    }).finally(() => {
      event.reply('guideGoToRcWebEvent-reply')
    })
  } else {
    dialog.showErrorBox("Error", "Please enter correct url")
    event.reply('guideGoToRcWebEvent-reply')
  }
})

ipcMain.on('revNewMessageEvent', () => {
  if (badgeShow) {
    const badge = app.dock.getBadge();
    if (badge === '') {
      app.dock.setBadge('1');
    } else {
      app.dock.setBadge((parseInt(badge) + 1).toString())
    }
  }
})

module.exports = {
  logout,
  jumpToGuidePage,
  initPage,
  setBadgeStatus
}
