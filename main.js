const { app, BrowserWindow, Menu } = require('electron')
const resource = require('./src/resource')
const menu = require('./src/menu')
const controller = require('./src/controller')
const store = require('./src/store')

// set menu
Menu.setApplicationMenu(Menu.buildFromTemplate(menu.getTemplate(app.name)))

function createWindow() {

  const defaultSize = {
    w: 1000,
    h: 800
  }
  const size = store.getWindowSize() ?? defaultSize

  // 创建浏览器窗口
  let win = new BrowserWindow({
    width: size.w,
    height: size.h,
    show: false,
    resizable: true,
    fullscreen: false,
    frame: true,
    autoHideMenuBar: false,
    webPreferences: {
      preload: resource.getGuideScriptPath(),
      contextIsolation: false,
    },
    backgroundColor: '#2f343d'
  })

  // 加载src/index.html文件
  controller.initPage(win)

  win.once('ready-to-show', () => {
    win.show()
  })

  let willQuitApp = false

  win.on('close', (e) => {
    const { width, height } = win.getContentBounds()
    store.saveWindowSize(width, height)
    if (willQuitApp) {
      win = null
    } else {
      controller.setBadgeStatus(true)
      e.preventDefault()
      win.hide()
    }
  })

  win.on('closed', () => {
    win = null
  })

  app.on('activate', () => {
    controller.setBadgeStatus(false)
    win.show()
  })

  app.on('before-quit', () => {
    willQuitApp = true
  })
}

app.whenReady().then(createWindow)

