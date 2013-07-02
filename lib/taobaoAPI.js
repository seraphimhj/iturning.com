var querystring= require('querystring')
    , http= require('http')
    , https= require('https')
    , URL= require('url')
    , OAuth = require('oauth')
    , _ = require('underscore')


exports.apiGroup = {
  user:
  {
    getBuyer:
    {
      method: 'taobao.user.buyer.get',
      required:
      {
        fields: 'user_id,nick,sex,buyer_credit,avatar,has_shop,vip_info',
      }
    },
    getSeller:
    {
      method: 'taobao.user.seller.get',
      required:
      {
        fields: 'user_id,nick,sex,seller_credit,type,has_more_pic,item_img_num,item_img_size,prop_img_num,prop_img_size,auto_repost,promoted_type,status,alipay_bind,consumer_protection,avatar,liangpin,sign_food_seller_promise,has_shop,is_lightning_consignment,has_sub_stock,is_golden_seller,vip_info,magazine_subscribe,vertical_market,online_gaming',
      }
    },
  },
  item:
  {
    getOnsale:
    {
      method: 'taobao.items.onsale.get',
      required:
      {
        fields: 'approve_status,num_iid,title,nick,type,cid,pic_url,num,props,valid_thru,list_time,price,has_discount,has_invoice,has_warranty,has_showcase,modified,delist_time,postage_id,seller_cids,outer_id',
      }
    },       
    getInventory:
    {
      method: 'taobao.items.inventory.get',
      required:
      {
        fields: 'approve_status,num_iid,title,nick,type,cid,pic_url,num,props,valid_thru,list_time,price,has_discount,has_invoice,has_warranty,has_showcase,modified,delist_time,postage_id,seller_cids,outer_id',
      }
    },       
    update:
    {
      delist:
      {
        method: 'taobao.item.update.delisting',
        required:
        {
          num_iid: '',
        }
      },
      list:
      {
        method: 'taobao.item.update.listing',
        required:
        { 
          num_iid: '',
          num_num: '1', 
        }
      },
    },
  },
};

exports.taobaoAPI = function(config) {
  this._baseUrl = config['base_url'] || 'https://gw.api.tbsandbox.com/router/rest';
  this._accessTokenName= "access_token";
  this._access_token = config['access_token'];
  this._customHeaders = config['customHeaders'] || {};
  this._redirect_uri = config['redirect_uri'];
  this._oauth2 = new OAuth.OAuth2(
    config['app_key'],
    config['app_secret'],
    config['productOauthURL'],
    'authorize',
    'token'
  );
  authorizeParams = {      
    'client_id' : config['app_key'],
    'redirect_uri' : config['redirect_uri'],
    'response_type': 'code',
    'view' : 'web'
  }
  this._authorizeUrl = config['productOauthURL']
    + 'authorize?' + querystring.stringify(authorizeParams);
}

exports.taobaoAPI.prototype.getOAuthAccessToken = function(authorizeCode, callback) {
  this._oauth2.getOAuthAccessToken(authorizeCode, {
      'grant_type':'authorization_code',
      'redirect_uri': this._redirect_uri,
    }, callback);
};

exports.taobaoAPI.prototype.getAuthorizeUrl = function() {
  return this._authorizeUrl;
}

/*
params:
  method: string, API接口名称, required
  format: xml(default) or json, optional
  access_token: reuqired
  v : 2.0, required
*/
exports.taobaoAPI.prototype.baseCall = function(params, callback) {
  var params = params || {};
  params['access_token'] = params['access_token'] || this._access_token;
  params['v'] = '2.0';
  params['format'] = 'json';
  // params['time'] = 'json';
  var post_headers= {
       'Content-Type': 'application/x-www-form-urlencoded'
  };
  this._request("GET", this._baseUrl, post_headers, params, function(error, data, response) {
    if( error ) {
      console.log(error);
      callback(error);
    }
    else {
      var results;
      try {
        // As of http://tools.ietf.org/html/draft-ietf-oauth-v2-07
        // responses should be in JSON
        results= JSON.parse( data );
      }
      catch(e) {
        results= querystring.parse( data );
      }
      callback(results); // callback results =-=
    }
  })
}

exports.taobaoAPI.prototype._request= function(method, url, headers, queryParams, callback) {
  var http_library= https;
  var parsedUrl= URL.parse( url, true );
  if( parsedUrl.protocol == "https:" && !parsedUrl.port ) {
    parsedUrl.port= 443;
  }

  // As this is OAUth2, we *assume* https unless told explicitly otherwise.
  if( parsedUrl.protocol != "https:" ) {
    http_library= http;
  }

  var realHeaders= {};
  for( var key in this._customHeaders ) {
    realHeaders[key]= this._customHeaders[key];
  }
  if( headers ) {
    for(var key in headers) {
      realHeaders[key] = headers[key];
    }
  }
  realHeaders['Host']= parsedUrl.host;

  var queryStr= querystring.stringify(queryParams);
  if( queryStr ) queryStr=  "?" + queryStr;

  var options = {
    host: parsedUrl.hostname,
    port: parsedUrl.port,
    path: parsedUrl.pathname + queryStr,
    method: method,
    headers: realHeaders,
    rejectUnauthorized: false,
    requestCert: true,
    agent: false
  };
  this._executeRequest( http_library, options, null, callback );
}

exports.taobaoAPI.prototype._executeRequest= function( http_library, options, post_body, callback ) {
  var callbackCalled= false;
  function passBackControl( response, result ) {
    if(!callbackCalled) {
      callbackCalled=true;
      if( response.statusCode != 200 && (response.statusCode != 301) && (response.statusCode != 302) ) {
        callback({ statusCode: response.statusCode, data: result });
      } else {
        callback(null, result, response);
      }
    }
  }

  var result= "";

  var request = http_library.request(options, function (response) {
    response.on("data", function (chunk) {
      result+= chunk
    });
    response.on("close", function (err) {
      if( allowEarlyClose ) {
        passBackControl( response, result );
      }
    });
    response.addListener("end", function () {
      passBackControl( response, result );
    });
  });
  request.on('error', function(e) {
    callbackCalled= true;
  });

  if(  options.method == 'POST' && post_body ) {
     request.write(post_body);
  }
  request.end();  
}
