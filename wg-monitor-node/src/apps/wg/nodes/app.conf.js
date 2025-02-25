const {router} = app.CreateApp();

router.use("/client", require("./endpoints/clients"))
router.use("/provider", require("./endpoints/providers"))

module.exports = router;