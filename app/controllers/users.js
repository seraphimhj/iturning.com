
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , Product = mongoose.model('Product')

exports.signin = function (req, res) {}

/**
 * Auth callback
 */

exports.authCallback = function (req, res, next) {
  res.redirect('/')
}

/**
 * Show login form
 */

exports.login = function (req, res) {
  var options = {
    perPage: 999,
    page: 0
  }
  Product.list(options, function(err, products) {
    if (err) return res.render('500', {
      products: products
    })
    Product.count().exec(function (err, count) {
      res.render('users/login', {
        products: products,
        title: 'Login',
        message: req.flash('error')
      })
    })
  })
}

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
  var options = {
    perPage: 999,
    page: 0
  }
  Product.list(options, function(err, products) {
    if (err) return res.render('500', {
      products: products
    })
    Product.count().exec(function (err, count) {
      res.render('users/signup', {
        products: products,
        title: 'Sign up',
        user: new User()
      })
    })
  })
}

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout()
  res.redirect('/login')
}

/**
 * Session
 */

exports.session = function (req, res) {
  res.redirect('/')
}

/**
 * Create user
 */

exports.create = function (req, res) {
  var user = new User(req.body)
  user.provider = 'local'
  user.save(function (err) {
    if (err) {
      return res.render('users/signup', { errors: err.errors, user: user })
    }
    req.logIn(user, function(err) {
      if (err) return next(err)
      return res.redirect('/')
    })
  })
}

/**
 *  Show profile
 */

exports.show = function (req, res) {
  var user = req.profile
  var options = {
    perPage: 999,
    page: 0
  }
  Product.list(options, function(err, products) {
    if (err) return res.render('500', {
      products: products
    })
    Product.count().exec(function (err, count) {
      res.render('users/show', {
        products: products,
        title: user.name,
        user: user,
      })
    })
  })
}

/**
 * Find user by id
 */

exports.user = function (req, res, next, id) {
  User
    .findOne({ _id : id })
    .exec(function (err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Failed to load User ' + id))
      req.profile = user
      next()
    })
}
