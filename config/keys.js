// keys.js figure out what set of credentials to return
if (process.env.NODE_ENV === 'production') {
  // We are in production environment - return producution keys (NODE_ENV is a built-in Heroku variable)
  module.exports = require('./prod');
} else {
  // We are in dev environment - return dev keys
  module.exports = require('./dev');
}
