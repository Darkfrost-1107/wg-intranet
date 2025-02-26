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
}, db.CreateClient().clientNode)

async function getWgClientConfig(req, res){
  const {owner, id} = req.params;
  const client = await controller.find({
    where: {
      id,
      owner: {
        is: {
          id: owner
        }
      }
    },
    include:{
      gateway: true
    }
  })

  if(client === null){
    res.status(404).json({
      detail: "Not-Found"
    })
    return;
  }
  
  res.append('Content-Disposition', `attachment; filename="${ client.interfaceName }.conf"`);
  res.append('Content-Type', 'text/plain');

  const config = await wg.getWgClientConfig(client)
  res.send(config)
}

router.get("/:owner/:id/getConfig", [auth.hasOwnership], getWgClientConfig)
router.post("/:owner/:id/getConfig", [auth.APIAuth], getWgClientConfig)

router.post("/:owner/:id/assignGateway", [auth.authMiddleWare, auth.includeRoles(["SUPERADMIN", "USER"]), auth.hasOwnership], async (req, res) => {
  const {owner, id} = req.params;
  const {gatewayId} = req.body;
  if(gatewayId === undefined){
    res.status(400).json({
      detail: "Bad-Request"
    })
    return 
  }

  const client = await controller.find({
    where: {
      id,
      owner: {
        is: {
          id: owner
        }
      }
    }
  })

  if(client === null){
    res.status(404).json({
      detail: "Not-Found Client"
    })
    return;
  }

  const gateway = await db.CreateClient().gateway.findFirst({
    where: {
      id: gatewayId
    }
  })

  if(gateway === null){
    res.status(404).json({
      detail: "Not-Found Provider"
    })
    return;
  }

  if(gateway.access == "PRIVATE"){
    res.status(403).json({
      detail: "Forbidden"
    })
    return;
  }

  if(gateway.access == "PUBLIC"){
    const result = await controller.update({
      where: {
        id,
        owner: {
          is: {
            id: owner
          }
        }
      },
      data: {
        gateway: {
          connect: {
            id: gatewayId
          }
        }
      }
    })
    
    res.json({
      detail: "Assigned",
      data: result
    })
    return;
  }
  res.status(500).json({
    detail: "Internal-Server-Error"
  })
})
module.exports = router;