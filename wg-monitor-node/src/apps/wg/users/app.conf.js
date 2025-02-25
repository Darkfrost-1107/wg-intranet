const {router} = app.CreateApp();

router.use("/login", require("./endpoints/login"))
router.use("/user", require("./endpoints/user"))
router.use("/clients", require("./endpoints/clients"))
router.use("/monitors", require("./endpoints/monitors"))
router.use("/providers", require("./endpoints/providers"))

module.exports = router;