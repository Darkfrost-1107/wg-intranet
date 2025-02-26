
/**
 * @file cors.conf.js
 * @description Configuración de CORS
 * Resumen de todo lo relacionado a CORS
 */
const cors = require('cors');

function addCORS(app) {

  /**
   * Configuración de CORS, por defecto, all origins Allowed
   * En este caso concreto solo se permite el acceso desde localhost:3000 con credenciales
   */
  
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
}

module.exports = {
  addCORS
}