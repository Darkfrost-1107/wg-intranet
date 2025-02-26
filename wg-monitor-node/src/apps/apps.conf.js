/**
 * @file apps.conf.js
 * @description Configuracion e integración de las apps
 * Se utiliza una arquitectura similar a Django, los servicios se separaran por apps
 * 
 * */ 
const {router} = app.CreateApp();

/**
 * De esta forma se pueden implementar diferentes apps, 
 * 
 */
router.use("/wireguard", require("./wg/app.conf.js"))

module.exports = router;

