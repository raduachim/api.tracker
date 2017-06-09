const Koa = require('koa')
const Raven = require('raven')
const nconf = require('nconf')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const cors = require('koa-cors')
const bugsnag = require('bugsnag')

const app = new Koa()
const router = new Router()
const db = require('./adapters/db')
const workouts = require('./resources/workouts/routes.js')

// configuration
app.use(bodyParser())
app.use(cors())

nconf
  .env()
  .file({ file: './config.json' })

Raven
  .config(nconf.get('ravenKey'))
  .install()

bugsnag.register(nconf.get('bugsnagKey'))

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

// sentry.io error reporter
// app.on('error', (err) => {
//   Raven.captureException(err, (err, eventId) => {
//     console.log(`Reported error ${eventId}`)
//   })
// })

app.on('error',bugsnag.koaHandler)

router.get('/', (ctx, next) => {
  ctx.body = 'If it ends with 200 it is OK!'
})

router.get('/workouts', workouts.getList)
router.get('/workouts/:id', workouts.getOne)
router.post('/workouts', workouts.create)

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000)