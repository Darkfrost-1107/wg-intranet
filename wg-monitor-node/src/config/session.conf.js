/**
 * @file session.conf.js
 * @description Configuración de las sesiones
 * Resumen de todo lo relacionado a las sesiones de usuarios
 */

const session = require('express-session');
const SQLiteStore = require("connect-sqlite3")(session);
const csrf = require('csurf');
function addSession(app) {

  // Secret para encriptar las sess_id
  const secret = "SECRET-KEY-WTF"
  const csrfProtection = csrf({ cookie: true }); // CSRF Protection

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
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',

      // Tiempo de vida de la session : 1 día
      maxAge: 1 * 24 * 60 * 60 * 1000
    },
    rolling: true
  }));

app.use(csrfProtection); // CSRF Protection

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();  // El token CSRF se puede acceder en las vistas
  next();
});
}

module.exports = {
  addSession
}