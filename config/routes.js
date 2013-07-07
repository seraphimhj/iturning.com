
var async = require('async')

module.exports = function (app, passport, auth) {

  // user routes
  var users = require('../app/controllers/users')
  app.get('/login', users.login)
  app.get('/signup', users.signup)
  app.get('/logout', users.logout)
  app.post('/users', users.create)
  app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid email or password.'}), users.session)
  app.get('/users/:userId', users.show)
  
  app.param('userId', users.user)
  
  // product routes
  var products = require('../app/controllers/products')
  app.get('/about', products.about)
  app.get('/contact', products.contact)
  app.get('/network', products.network)
  app.param('id', products.product)

  // Taobao api
  var taobao = require('../app/controllers/taobao')
  app.get('/oauth', taobao.oauth)
  app.get('/sync', taobao.verifyAccessToken, taobao.verifyTbData, taobao.sync)
  app.get('/product', taobao.verifyTbData, taobao.product)
 
  // home route
  app.get('/', taobao.verifyTbData, taobao.index)
      
  // comment routes
  var comments = require('../app/controllers/comments')
  app.post('/articles/:id/comments', auth.requiresLogin, comments.create)

  // tag routes
  var tags = require('../app/controllers/tags')
  app.get('/tags/:tag', tags.index)

}
