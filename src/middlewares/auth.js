const createError = require('http-errors')

function ensureNoActiveSession (req, res, next) {
  if (req.isAuthenticated()) return next(createError.BadRequest())
  next()
}

function ensureAuth (req, res, next) {
  if (!req.isAuthenticated()) return next(createError.Unauthorized())
  next()
}

function ensureRole (roles = []) {
  return function (req, res, next) {
    const requiredRoles = Array.isArray(roles) ? roles : [roles]

    if (req.isAuthenticated() && requiredRoles.includes(req.user.role)) {
      return next()
    }

    next(createError.Unauthorized())
  }
}

module.exports = {
  ensureAuth,
  ensureRole,
  ensureNoActiveSession
}
