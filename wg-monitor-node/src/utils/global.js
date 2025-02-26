/**
 * @file global.js
 * @description Archivo global de la aplicación
 * Se importan todos los servicios y configuraciones de la aplicación
 */

// Relacionados a la configuración de la aplicación
require("./app.service.js");

// Relacionados a la configuración de las sesiones
require("./middleware/auth.service.js");

// Relacionados a la conexión con la base de datos
require("./database.service.js");

// Relacionados al uso de Wireguard
require("./wg/wg-conf.service.js")

