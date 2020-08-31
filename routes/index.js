const routes = require('./routes')
const router = require('./routes')

module.exports = (app) => {
  app.use('/', routes)
}