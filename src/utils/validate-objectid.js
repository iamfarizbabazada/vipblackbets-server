const createError = require('http-errors')
const ObjectId = require('mongoose').Types.ObjectId

function validateObjectId (id) {
  if (!ObjectId.isValid(id)) throw createError(404)
}

function bulkValidateObjectId (idsArray) {
  for (const id of idsArray) {
    validateObjectId(id)
  }
}

module.exports = {
  validateObjectId,
  bulkValidateObjectId
}
