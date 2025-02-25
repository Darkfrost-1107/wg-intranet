const crypt = require("crypto-js");

const {router} = app.CreateControllerApp({
  findall: {
    middleware: [auth.authMiddleWare, auth.includeRoles(["SUPERADMIN"])],
    process: (query) => query
  },
  find: {
    middleware: [auth.authMiddleWare, auth.includeRoles(["SUPERADMIN", "USER"]), auth.hasOwnership],
    process: (params) => params,
    url: "/:owner/:id",
  },
  create: {
    middleware: [auth.authMiddleWare, auth.includeRoles(["SUPERADMIN"])],
    process: (body) => body
  },
  update: {
    middleware: [auth.authMiddleWare, auth.includeRoles(["SUPERADMIN", "USER"]), auth.hasOwnership],
    process: (body) => body,
    url: "/:owner/:id"
  },
  delete: {
    middleware: [auth.authMiddleWare, auth.includeRoles(["SUPERADMIN"])],
    process: (params) => params
  }
}, db.CreateClient().client)

module.exports = router;