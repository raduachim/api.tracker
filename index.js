const Koa = require('koa')
const Raven = require('raven')
const nconf = require('nconf')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')

const app = new Koa()
const router = new Router()

function getData () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ id: 1, name: 'Lorem ipsum' })
    }, 2000)
  })
}

// configuration
nconf
  .env()
  .file({ file: './config.json' })

Raven
  .config(nconf.get('ravenKey'))
  .install()

app.use(bodyParser())

// x-response-time header
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms} ms`)
})

// logger
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms} ms`)
})

app.on('error', (err) => {
  Raven.captureException(err, (err, eventId) => {
    console.log(`Reported error ${eventId}`)
  })
})

router.get('/', (ctx, next) => {
  ctx.body = 'Hello Work'
})

router.post('/', async (ctx, next) => {
  ctx.body = await getData()
})

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000)