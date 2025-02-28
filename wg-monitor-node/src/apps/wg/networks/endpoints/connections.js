const {router} = app.CreateControllerApp({
  findall: {
    middleware: [auth.sessionAuth, auth.includeRoles(["SUPERADMIN"])],
    process: (query) => query
  },
  find: {
    middleware: [auth.sessionAuth, auth.includeRoles(["SUPERADMIN"])],
    process: (params) => params,
  },
  create: {
    middleware: [auth.sessionAuth, auth.includeRoles(["SUPERADMIN"])],
    process: (body) => body
  },
  update: {
    middleware: [auth.sessionAuth, auth.includeRoles(["SUPERADMIN"])],
    process: (body) => body,
  },
  delete: {
    middleware: [auth.sessionAuth, auth.includeRoles(["SUPERADMIN"])],
    process: (params) => params
  }
}, db.CreateClient().networkConnection)

module.exports = router;