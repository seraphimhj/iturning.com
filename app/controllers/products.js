
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , async = require('async')
  , Product = mongoose.model('Product')
  , _ = require('underscore')

/**
 * Find product by id
 */

exports.product = function(req, res, next, id){
  var User = mongoose.model('User')

  Product.load(id, function (err, product) {
    if (err) return next(err)
    if (!product) return next(new Error('Failed to load product ' + id))
    req.product = product
    next()
  })
}

/**
 * View an article
 */

exports.show = function(req, res){
  var options = {
    perPage: 999,
    page: 0
  }
  Product.list(options, function(err, products) {
    if (err) return res.render('500', {
      products: products
    })
    Product.count().exec(function (err, count) {
      res.render('products/show', {
        title: req.product.title,
        product: req.product,
        products: products,
        randomID: parseInt(Math.random()*req.product.video.youkuids.length)
      })
    })
  })
}

/**
 * Delete an product
 */

exports.destroy = function(req, res){
  var product = req.product
  product.remove(function(err){
    // req.flash('notice', 'Deleted successfully')
    res.redirect('/products')
  })
}

/**
 * List of Products
 */

exports.index = function(req, res){
  /**
   * show all
   */
  var options = {
    perPage: 999,
    page: 0
  }

  Product.list(options, function(err, products) {
    if (err) return res.render('500', {
      products: products
    })
    return res.render('products/index', {
      title: '产品列表',
      products: products
    })
  })
}

/**
 * List of Products‘ Video
 */

exports.video = function(req, res){
  /**
   * show all
   */
  var options = {
    perPage: 999,
    page: 0
  }

  var videos = ["../../video/combine1.flv", "../../video/combine3.flv", "../../video/combine2.mp4"] 

  Product.list(options, function(err, products) {
    if (err) return res.render('500', {
      products: products
    })
    return res.render('products/video', {
      title: '实地拍摄糊盒机流程',
      products: products,
      videos: videos,
    })
  })
}


/**
 * About
 */

exports.about = function(req, res){
  /**
   * show all
   */
  var options = {
    perPage: 999,
    page: 0
  }

  Product.list(options, function(err, products) {
    if (err) return res.render('500', {
      products: products
    })
    return res.render('products/about', {
      title: '公司介绍',
      products: products
    })
  })
}


/**
 * Contact
 */

exports.contact = function(req, res){
  /**
   * show all
   */
  var options = {
    perPage: 999,
    page: 0
  }

  Product.list(options, function(err, products) {
    if (err) return res.render('500', {
      products: products
    })
    return res.render('products/contact', {
      title: '联系方式',
      products: products
    })
  })
}


/**
 * Contact
 */

exports.network = function(req, res){
  /**
   * show all
   */
  var options = {
    perPage: 999,
    page: 0
  }

  Product.list(options, function(err, products) {
    if (err) return res.render('500', {
      products: products
    })
    return res.render('products/network', {
      title: '销售网络',
      products: products
    })
  })
}

/**
 * initial products
 */

exports.initial = function(req, res){
  Product.remove().exec()

  var product = new Product({})
  product.title = "ES800AC高速全自动糊盒机"
  product.body = "ES800AC高速全自动糊盒机"
  product.image.cdnUri = "../img/products/es800ac"
  product.image.files = ['image001.jpg', 'image002.jpg', 'image003.jpg', 'image004.jpg', 'image005.jpg', 'image006.jpg', 'image007.jpg', 'origin.jpg', 'size_350.jpg', 'size_800.jpg']
  product.image.descript = ['', '', '', '', '', '', '主要技术参数', '原始图', '缩略图', '横版图']
  product.tags = ['高速自动糊盒机']
  product.video.youkuids = ['XNTQzMzY1NDcy', 'XNTY1NTMxNzA0', 'XNTY1NTQ2NTQ0', 'XNTY1NTQ2ODQw', 'XNTY1NTc1ODM2', 'XNTY1NTc2OTYw', 'XNTY1NTgyNDU2', 'XNTY1NTgyOTQw']
  product.video.posters = ['poster001.png', 'poster002.png', 'poster003.png', 'poster004.png', 'poster005.png', 'poster006.png', 'poster007.png', 'poster008.png']
  product.save(function(err) {
    if (err) return next(err)
  })
  delete product

  var product = new Product({})
  product.title = "ZH-900型高速自动纸盒糊盒机"
  product.body = "ZH-900型高速自动纸盒糊盒机"
  product.image.cdnUri = "../img/products/zh900"
  product.image.files = ['image001.jpg', 'image002.jpg', 'image003.jpg', 'image004.jpg', 'image005.jpg', 'image006.jpg', 'image007.jpg', 'origin.jpg', 'size_350.jpg', 'size_800.jpg']
  product.image.descript = ['', '', '', '', '', '', '主要技术参数', '原始图', '缩略图', '横版图']
  product.tags = ['高速自动糊盒机']
  product.video.youkuids = ['XNTQzMzY1NDcy', 'XNTY1NTMxNzA0', 'XNTY1NTQ2NTQ0', 'XNTY1NTQ2ODQw', 'XNTY1NTc1ODM2', 'XNTY1NTc2OTYw', 'XNTY1NTgyNDU2', 'XNTY1NTgyOTQw']
  product.video.posters = ['poster001.png', 'poster002.png', 'poster003.png', 'poster004.png', 'poster005.png', 'poster006.png', 'poster007.png', 'poster008.png']
  product.save(function(err) {
    if (err) return next(err)
  })
  delete product

  var product = new Product({})
  product.title = "ZH-900B型高速自动纸盒糊盒机"
  product.body = "ZH-900B型高速自动纸盒糊盒机"
  product.image.cdnUri = "../img/products/zh900b"
  product.image.files = ['image001.jpg', 'image002.jpg', 'image003.jpg', 'image004.jpg', 'image005.jpg', 'image006.jpg', 'origin.jpg', 'size_350.jpg', 'size_800.jpg']
  product.image.descript = ['', '', '', '', '', '主要技术参数', '原始图', '缩略图', '横版图']
  product.tags = ['高速自动糊盒机']
  product.video.youkuids = ['XNTQzMzY1NDcy', 'XNTY1NTMxNzA0', 'XNTY1NTQ2NTQ0', 'XNTY1NTQ2ODQw', 'XNTY1NTc1ODM2', 'XNTY1NTc2OTYw', 'XNTY1NTgyNDU2', 'XNTY1NTgyOTQw']
  product.video.posters = ['poster001.png', 'poster002.png', 'poster003.png', 'poster004.png', 'poster005.png', 'poster006.png', 'poster007.png', 'poster008.png']
  product.save(function(err) {
    if (err) return next(err)
  })
  delete product

  var product = new Product({})
  product.title = "ZH-900C型高速自动纸盒糊盒机"
  product.body = "ZH-900C型高速自动纸盒糊盒机"
  product.image.cdnUri = "../img/products/zh900c"
  product.image.files = ['image001.jpg', 'image002.jpg', 'image003.jpg', 'image004.jpg', 'image005.jpg', 'image006.jpg', 'origin.jpg', 'size_350.jpg', 'size_800.jpg']
  product.image.descript = ['', '', '', '', '', '主要技术参数', '原始图', '缩略图', '横版图']
  product.tags = ['高速自动糊盒机']
  product.video.youkuids = ['XNTQzMzY1NDcy', 'XNTY1NTMxNzA0', 'XNTY1NTQ2NTQ0', 'XNTY1NTQ2ODQw', 'XNTY1NTc1ODM2', 'XNTY1NTc2OTYw', 'XNTY1NTgyNDU2', 'XNTY1NTgyOTQw']
  product.video.posters = ['poster001.png', 'poster002.png', 'poster003.png', 'poster004.png', 'poster005.png', 'poster006.png', 'poster007.png', 'poster008.png']
  product.save(function(err) {
    if (err) return next(err)
  })
  delete product
  return res.render('404')
}
