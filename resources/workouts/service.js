const db = require('../../adapters/db')

async function getList () {
  return await db.table('workouts')
}

async function create ({ name }) {
  const result = await db
    .table('workouts')
    .insert({ name, id: "c21b2aeb-922e-4631-ba7a-b6eb0666660e" })
  
  if (!result.generated_keys) {
    throw new Error(result.first_error)
  }
  
  return { name, id: result.generated_keys[0] }
}

module.exports = {
  getList,
  create
}