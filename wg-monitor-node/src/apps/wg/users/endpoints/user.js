const crypt = require("crypto-js");

const {router} = app.CreateControllerApp({
  findall: {
    middleware: [auth.authMiddleWare, auth.includeRoles(["SUPERADMIN"])],
    process: (query) => {
      return { ...query,
        omit: {
          password: true
        }
      }
    }
  },
  find: {
    middleware: [auth.authMiddleWare, auth.includeRoles(["SUPERADMIN", "USER"]), auth.hasOwnership],
    process: (params) => {
      return { ...params,
        omit: {
          password: true
        }
      }
    },
  },
  create: {
    middleware: [auth.authMiddleWare, auth.includeRoles(["SUPERADMIN"])],
    process: (body) => {
      const {data} = body
      if(!data.username || !data.email || !data.password) {
        throw new Error("Invalid Data")
      }
      data.password = crypt.SHA256(data.password).toString()
      return {
        data
      }
    }
  },
  update: {
    middleware: [auth.authMiddleWare, auth.includeRoles(["SUPERADMIN", "USER"]), auth.hasOwnership],
    process: (body) => body
  },
  delete: {
    middleware: [auth.authMiddleWare, auth.includeRoles(["SUPERADMIN"])],
    process: (params) => params
  }
}, db.CreateClient().user)

module.exports = router;