const express = require('express')
const {addCORS} = require('./cors.conf')
const {addBodyParser} = require('./body-parser.conf')
const {addSession} = require('./session.conf')

const router = require('../apps/apps.conf.js')

const app = express()

function start(config) {
  const port = config.port

  addCORS(app)
  addBodyParser(app)
  addSession(app)

  app.use("/", router)

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

module.exports = {
  app,
  start
}