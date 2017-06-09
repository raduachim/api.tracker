const service = require('./service')

async function getList (ctx, next) {
  ctx.body = await service.getList()
}

async function getOne (ctx, next) {
  ctx.body = await service.getOne(ctx.request.params.id)
}

module.exports = {
  getOne,
  getList
  // create,
  // del
}