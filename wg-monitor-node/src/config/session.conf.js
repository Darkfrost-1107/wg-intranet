const session = require('express-session');

function addSession(app) {
  const secret = "SECRETKEY-WTF"

  app.use(session({
    secret,
    resave: false,
    saveUninitialized: true,
  }))
}

module.exports = {
  addSession
}