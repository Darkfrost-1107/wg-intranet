const {router} = app.CreateApp();

router.use("/wireguard", require("./wg/app.conf.js"))

module.exports = router;