const {router} = app.CreateApp()

router.use("/connection", require("./endpoints/connections"))

module.exports = router