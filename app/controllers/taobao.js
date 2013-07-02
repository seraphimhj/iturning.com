/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , async = require('async')
  , _ = require('underscore')
  //, taobao_config = require('../../config/config')['taobao']['production']
  , taobao_config = require('../../config/config')['taobao']['sandbox']
  , OAuth = require('oauth')
  , https = require('https')
  , taobao = require('../../lib/taobaoAPI').taobaoAPI
  , tbApiGroup = require('../../lib/taobaoAPI').apiGroup
  , querystring= require('querystring');
                                                        
var taobaoAPI = new taobao(taobao_config);

exports.oauth = function(req, res){
  delete req.session.access_token
  authorizeUrl = taobaoAPI.getAuthorizeUrl();
  res.redirect(authorizeUrl)
}

// middleware
exports.getAccessToken = function(req, res, next){
  if (req.session.access_token != undefined) {
    next();
  } else {
    authorizeCode = req.query.code;
    if (authorizeCode == undefined) {
      res.redirect('/oauth')
    } else {
      taobaoAPI.getOAuthAccessToken(authorizeCode, 
          function(err, access_token, refresh_token, results){
        console.log(err);
        req.session.access_token = access_token;
        req.session.refresh_token = refresh_token;
        next();
      });
    }
  }
}

exports.products = function(req, res){
  // var requestApi = tbApiGroup.item.getInventory;
  var requestApi = tbApiGroup.item.getOnsale;
  params = {
    method: requestApi.method,
    fields: requestApi.required.fields, 
    access_token: req.session.access_token,
  };
  taobaoAPI.baseCall(params, function (data) {
    console.log(data)
    response = data.items_onsale_get_response
    if (!response) {
      item_list = {} 
    } else {
      item_list = response.items.item  
    }
    console.log(item_list);
    return res.render('taobao/products',
      {
        // products: JSON.stringify(data),
        // products: JSON.stringify(item_list),
        products: item_list,
      });
  });
}

exports.index = function(req, res){
  // var requestApi = tbApiGroup.item.getOnsale;
  var requestApi = tbApiGroup.user.getSeller;
  params = {
    method: requestApi.method,
    fields: requestApi.required.fields, 
    access_token: req.session.access_token,
  };
  taobaoAPI.baseCall(params, function (data) {
    console.log(data);
    return res.render('taobao/user',
      {
        user: data.user_seller_get_response.user,
      });
  });
}
