const db = require('../../adapters/db')

async function getList () {
  return await db.table('workouts')
}

module.exports = {
  getList
}