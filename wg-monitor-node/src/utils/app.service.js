const express = require('express')

function CreateApp () {
  const router = express.Router()
  return {router}
}

class AppController {

  /**
   * 
   * @param {*} db_controller use a PrismaClient() repository
   */
  constructor(db_controller) {
    this.db_controller = db_controller
  }

  /**
   * 
   * @param {*} params 
   * {
   * skip: number,
   * take: number,
   * cursor: string,
   * where: object,
   * orderBy: ??,
   * omit: [object_param]
   * data: object
   * }
   * @returns 
   */

  async findAll (params) {
    if(params === undefined) {
      return await this.db_controller.findMany()
    }

    const { skip, take, cursor, where, orderBy, omit } = params
    return await this.db_controller.findMany({
      skip, take, cursor, where, orderBy, omit
    })
  }

  async find (params) {
    const { where, omit } = params
    return await this.db_controller.findFirst({
      where,
      omit,
    })
  }

  async create (params) {
    const { data } = params
    return await this.db_controller.create({
      data
    })
  }

  async update (params) {
    const { where, data } = params
    return await this.db_controller.update({
      where, data
    })
  }

  async delete (params) {
    const { where } = params
    return await this.db_controller.delete({
      where
    })
  }
}

/**
 * 
 * @param {*} config
 * route-options = "findall, find, create, update, delete"
 * TYPE of config
 * {
 *  [key: route-options]: {
 *    middleware: Function[],
 *    process: Function
 *    url: string
 *  }
 * } 
 * @param {*} db_controller 
 * @returns 
 */
function CreateControllerApp (config, db_controller) {

  const controller = new AppController(db_controller)
  const router = express.Router()

  
  router.get(
    config.findAll?.url ?? '/', 
    config.findall?.middleware ?? [] , 
    async (req, res) => {
      const params = config.findall?.process(req.query, req) ?? req.query
      const result = await controller.findAll(params)
      res.json({
        detail: "Fetched",
        data: result
      })
  })

  router.get(
    config.find?.url ?? '/:id', 
    config.find?.middleware ?? [] , 
    async (req, res) => {
      const params = config.find?.process(req.params, req) ?? {where: req.params}
      const result = await controller.find(params)
      res.json({
        detail: "Fetched",
        data: result
      })
  })

  router.post(
    config.create?.url ?? '/', 
    config.create?.middleware ?? [] , 
    async (req, res) => {
      const data = config.create?.process(req.body, req) ?? req.body
      const result = await controller.create(data)
      res.json({
        detail: "Created",
        data: result
      })
  })

  router.put(
    config.update?.url ?? '/:id', 
    config.update?.middleware ?? [] , 
    async (req, res) => {
      const params = config.update?.process(req.body, req) ?? {...req.body, where: req.params}
      const result = await controller.update(params)
      res.json({
        detail: "Updated",
        data: result
      })
  })

  router.delete('/:id', config.delete?.middleware?? [] , async (req, res) => {
    const params = config.delete?.process(req.params, req) ?? {where: req.params}
    const result = await controller.delete(params)
    res.json({
      detail: "Deleted",
      data: result
    })
  })

  return {router, controller}
}

global.app = {
  CreateApp,
  CreateControllerApp,
}