const {router, controller} = app.CreateControllerApp({
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
}, db.CreateClient().providerNode)

async function getWgProviderConfig(req, res){
  const {owner, id} = req.params;
  const provider = await controller.find({
    where: {
      id,
      owner: {
        is: {
          id: owner
        }
      }
    },
    include:{
      clientNodes: true
    }
  })

  if(provider === null){
    res.status(404).json({
      detail: "Not-Found"
    })
    return;
  }
  
  res.append('Content-Disposition', `attachment; filename="${ provider.interfaceName }.conf"`);
  res.append('Content-Type', 'text/plain');

  const config = await wg.getWgProviderConfig(provider)
  res.send(config)
}

router.get("/:owner/:id/getConfig", [auth.hasOwnership], getWgProviderConfig)
router.post("/:owner/:id/getConfig", [auth.APIAuth], getWgProviderConfig)

module.exports = router;