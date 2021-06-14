const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const menu = require('./menu')
const controller = require('./controller')

// set menu
Menu.setApplicationMenu(Menu.buildFromTemplate(menu.getTemplate(app.name)))

function createWindow() {
  // 创建浏览器窗口
  let win = new BrowserWindow({
    width: 1000,
    height: 800,
    show: false,
    resizable: true,
    fullscreen: false,
    frame: true,
    autoHideMenuBar: false,
    webPreferences: {
      preload: path.join(__dirname, './app/main.js'),
      // close isolation to preload js
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

