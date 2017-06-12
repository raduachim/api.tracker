const db = require('../../adapters/db')

async function getList () {
  return await db.table('workouts')
}

async function create ({ name }) {
  const result = await db
    .table('workouts')
    .insert({ name })
  
  if (!result.generated_keys) {
    throw new Error(result.first_error)
  }
  
  return { name, id: result.generated_keys[0] }
}

module.exports = {
  getList,
  create
}