const crypt = require("crypto-js");
const uuid = require("uuid")

const {router, controller} = app.CreateControllerApp({
  findall: {
    middleware: [auth.sessionAuth, auth.includeRoles(["SUPERADMIN"])],
    process: (query) => {
      return { ...query,
        omit: {
          password: true
        }
      }
    }
  },
  find: {
    middleware: [auth.sessionAuth, auth.includeRoles(["SUPERADMIN", "USER"]), auth.hasOwnership],
    process: (params) => {
      return { ...params,
        omit: {
          password: true
        }
      }
    },
  },
  create: {
    middleware: [auth.sessionAuth, auth.includeRoles(["SUPERADMIN"])],
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
    middleware: [auth.sessionAuth, auth.includeRoles(["SUPERADMIN", "USER"]), auth.hasOwnership],
    process: (body) => body
  },
  delete: {
    middleware: [auth.sessionAuth, auth.includeRoles(["SUPERADMIN"])],
    process: (params) => params
  }
}, db.CreateClient().user)

router.get("/:id/getApiToken", [auth.sessionAuth, auth.includeRoles(["SUPERADMIN", "USER"]), auth.hasOwnership], async (req, res) => {
  
})

router.post("/:id/generateApiToken", [auth.sessionAuth, auth.includeRoles(["SUPERADMIN", "USER"]), auth.hasOwnership], async (req, res) => {
  const { id } = req.params;

  const token = uuid.v4()
  const user = await controller.update({
    where: { id },
    data: {
      apiToken: {
        create: {
          token
        }
      }
    }
  })

  res.json({
    detail: "Generated Token",
    token
  })
})

router.delete("/:id/deleteApiToken", [auth.sessionAuth, auth.includeRoles(["SUPERADMIN", "USER"]), auth.hasOwnership], async (req, res) => {

})

module.exports = router;