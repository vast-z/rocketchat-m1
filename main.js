const { app, BrowserWindow, Menu } = require('electron')
const resource = require('./src/resource')
const menu = require('./src/menu')
const controller = require('./src/controller')
const store = require('./src/store')
const util = require('./src/util')

// set menu
Menu.setApplicationMenu(Menu.buildFromTemplate(menu.getTemplate('Rocket.Chat.VV')))

let win = null
let willQuitApp = false
let tray = null

const createWindow = () => {

  const defaultSize = {
    w: 1000,
    h: 800
  }
  const size = store.getWindowSize() ?? defaultSize

  win = new BrowserWindow({
    width: size.w,
    height: size.h,
    show: false,
    resizable: true,
    fullscreen: false,
    frame: true,
    autoHideMenuBar: false,
    backgroundColor: '#2f343d',
    webPreferences: {
      preload: resource.getGuideScriptPath(),
      contextIsolation: false
    }
  })

  // 加载src/index.html文件
  controller.initPage(win)

  win.once('ready-to-show', () => {
    win.show()
  })

  willQuitApp = false

  win.on('close', (e) => {
    const { width, height } = win.getContentBounds()
    store.saveWindowSize(width, height)
    if (willQuitApp) {
      win = null
    } else {
      controller.setNotificationStatus(true)
      e.preventDefault()
      win.hide()
    }
  })

  win.on('closed', () => {
    win = null
  })

  app.on('activate', () => {
    controller.setNotificationStatus(false)
    win.show()
  })

  app.on('before-quit', () => {
    if (util.isMac()) {
      willQuitApp = true
    }
  })

  if (util.isWin()) {
    const { Tray, nativeImage } = require('electron')
    tray = new Tray(
      nativeImage.createFromPath(resource.getIcoPath())
    )
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Quit', click: () => {
          willQuitApp = true
          app.quit()
        }
      }
    ])
    tray.setToolTip('Rocket.Chat.VV')
    tray.on('click', () => {
      win.show()
    })
    tray.on('right-click', () => {
      tray.popUpContextMenu(contextMenu)
    })
  }
}

app.whenReady().then(createWindow)



