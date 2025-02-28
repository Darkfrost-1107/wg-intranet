const crypt = require("crypto-js");

const {router} = app.CreateControllerApp({
  findall: {
    middleware: [auth.sessionAuth, auth.includeRoles(["SUPERADMIN"])],
    process: (query) => query
  },
  find: {
    middleware: [auth.sessionAuth, auth.includeRoles(["SUPERADMIN", "USER"]), auth.hasOwnership],
    process: (params) => params,
    url: "/:owner/:id",
  },
  create: {
    middleware: [auth.sessionAuth, auth.includeRoles(["SUPERADMIN"])],
    process: (body) => body
  },
  update: {
    middleware: [auth.sessionAuth, auth.includeRoles(["SUPERADMIN", "USER"]), auth.hasOwnership],
    process: (body) => body,
    url: "/:owner/:id"
  },
  delete: {
    middleware: [auth.sessionAuth, auth.includeRoles(["SUPERADMIN"])],
    process: (params) => params
  }
}, db.CreateClient().provider)

module.exports = router;