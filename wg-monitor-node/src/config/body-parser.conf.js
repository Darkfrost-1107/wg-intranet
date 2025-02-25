const bp = require('body-parser')

function addBodyParser(app) {
  app.use(bp.json())
  app.use(bp.urlencoded({ extended: true }))
}

module.exports = {
  addBodyParser
}