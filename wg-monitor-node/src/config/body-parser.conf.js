/**
 * @file body-parser.conf.js
 * @description Configuración de body-parser
 * Resumen de todo lo relacionado a body-parser
 */

const bp = require('body-parser')

/**
 * Registro de formateo de datos en el cuerpo de la petición
 * 
 * # [Pendiente | TODO]:
 * - [ ] Reconsiderar el uso de body-parser
 * - [ ] Reconsiderar si es requerido otros formatos que URL-encoded (FormData) y JSON
 */
function addBodyParser(app) {
  app.use(bp.json())
  app.use(bp.urlencoded({ extended: true }))
}

module.exports = {
  addBodyParser
}