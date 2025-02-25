const {router} = app.CreateApp();

router.use("/users", require("./users/app.conf.js"))
router.use("/nodes", require("./nodes/app.conf.js"))
router.use("/networks", require("./networks/app.conf.js"))

module.exports = router;