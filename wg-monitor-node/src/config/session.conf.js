/**
 * @file session.conf.js
 * @description Configuración de las sesiones
 * Resumen de todo lo relacionado a las sesiones de usuarios
 */

const session = require('express-session');
const SQLiteStore = require("connect-sqlite3")(session);

function addSession(app) {

  // Secret para encriptar las sess_id
  const secret = "SECRET-KEY-WTF"

  /**
   * Configuración de las sesiones
   * En este caso se utiliza una base de datos SQLite para almacenar las sesiones
   * 
   * [Pendiente | TODO]:
   * - [ ] Reconsiderar una contingencia para ataques CSRF
   * - [ ] Reconsiderar el tiempo de vida de la sesión (posiblemente mas corto)
   */
  app.use(session({
    secret,
    store: new SQLiteStore,
    resave: false,
    saveUninitialized: true,
    cookie: {
      // Tiempo de vida de la session : 1 día
      maxAge: 1 * 24 * 60 * 60 * 1000
    }
  }))
}

module.exports = {
  addSession
}