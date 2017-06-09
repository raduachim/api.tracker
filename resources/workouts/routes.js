const service = require('./service')

async function getList (ctx, next) {
  ctx.body = await service.getList()
}

async function getOne (ctx, next) {
  ctx.body = await service.getOne(ctx.request.params.id)
}

async function create (ctx, next) {
  ctx.body = await service.create(ctx.request.body)
}

module.exports = {
  getOne,
  getList,
  create
  // del
}