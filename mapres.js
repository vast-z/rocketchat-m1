const path = require("path")

const guideViewUrl = new URL(
  path.join(__dirname, './app/index.html'),
  'file:'
)

const loadViewUrl = new URL(
  path.join(__dirname, './app/load.html'),
  'file:'
)

const loadScriptUrl = new URL(
  path.join(__dirname, './app/script/load.js')
)

