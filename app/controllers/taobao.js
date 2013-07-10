/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , async = require('async')
  , _ = require('underscore')
  , taobao_config = require('../../config/config')['taobao']['production']
  // , taobao_config = require('../../config/config')['taobao']['sandbox']
  , OAuth = require('oauth')
  , https = require('https')
  , taobao = require('../../lib/taobaoAPI').taobaoAPI
  , tbApiGroup = require('../../lib/taobaoAPI').apiGroup
  , querystring= require('querystring');
                                                        
var taobaoAPI = new taobao(taobao_config);

// for oauth to Taobao server
exports.oauth = function(req, res){
  authorizeCode = req.query.code;
  if (authorizeCode == undefined) {
    delete req.session.access_token
    authorizeUrl = taobaoAPI.getAuthorizeUrl();
    res.redirect(authorizeUrl)
  } else {
    taobaoAPI.getOAuthAccessToken(authorizeCode, 
        function(err, access_token, refresh_token, results){
      // console.log(err);
      req.session.access_token = access_token;
      req.session.refresh_token = refresh_token;
      res.redirect('/sync')
    });
  } 
}
  
// middleware
exports.verifyAccessToken = function(req, res, next){
  if (req.session.access_token) {
    next();
  } else {
    res.redirect('/oauth')
  }
} 

exports.verifyTbData = function(req, res, next) {
  is_sync = req.path.match('sync')
  if (is_sync) {
    if (req.session.taobao_data) {
      res.redirect('/');
    } else {
      next();
    }  
  } else {
    if (!req.session.taobao_data) {
      res.redirect('/sync');
    } else {
      next();
    }
  }
}

// Sync form Taobao
// get neccessary information
exports.sync = function(req, res){
  var taobao_data = {};
  async.series([
    // Get user info
    function(callback) { 
      var requestApi = tbApiGroup.user.getSeller;
      var params = {
        method: requestApi.method,
        fields: requestApi.required.fields, 
        access_token: req.session.access_token,
      }; 
      taobaoAPI.baseCall(params, function (data) {
        response = data.user_seller_get_response;
        if (response && response.user) {
          taobao_data.user = response.user;
        }
        callback();
      });
    }, 
    // Get onsale product info
    function(callback) { 
      var requestApi = tbApiGroup.item.getOnsale;
      var params = {
        method: requestApi.method,
        fields: requestApi.required.fields, 
        access_token: req.session.access_token,
      }; 
      taobaoAPI.baseCall(params, function (data) {
        response = data.items_onsale_get_response;
        if (response && response.items) {
          taobao_data.onsale_items = response.items.item;
        }
        callback();
      });
    },  
    // Get inventory product info
    function(callback) { 
      var requestApi = tbApiGroup.item.getInventory;
      var params = {
        method: requestApi.method,
        fields: requestApi.required.fields, 
        access_token: req.session.access_token,
      }; 
      taobaoAPI.baseCall(params, function (data) {
        response = data.items_inventory_get_response;
        if (response && response.items) {
          taobao_data.inventory_items = response.items.item;
        }
        callback();
      });
    },
  ],
  function() { 
    // msg = JSON.stringify(taobao_data);
    // res.writeHead(200, {
    //   "Content-Type":"application/json",
    //   "Content-Length":msg.length,
    // });
    // res.end(msg);  
    req.session.taobao_data = taobao_data;
    res.redirect('/')
  }); 
}             

// Render pages
exports.product = function(req, res){
  return res.render('taobao/products',
  {
    products: req.session.taobao_data.onsale_items,
  });
}

exports.index = function(req, res){
  return res.render('taobao/user',
  {
    user: req.session.taobao_data.user,
  });
}    
 
exports.redirect = function(req, res) {
  return res.redirect('http://item.taobao.com/item.htm?id=26027780484');
}
