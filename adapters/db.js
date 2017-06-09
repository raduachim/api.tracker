const r = require('rethinkdbdash')

module.exports = r({
  host: 'localhost',
  port: '28015',
  db: 'tracker'
})