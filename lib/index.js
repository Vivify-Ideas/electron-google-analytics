'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Analytics = function () {
  /**
   * Class constructor
   */
  function Analytics(trackingID) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$userAgent = _ref.userAgent,
        userAgent = _ref$userAgent === undefined ? '' : _ref$userAgent,
        _ref$debug = _ref.debug,
        debug = _ref$debug === undefined ? false : _ref$debug,
        _ref$version = _ref.version,
        version = _ref$version === undefined ? 1 : _ref$version;

    _classCallCheck(this, Analytics);

    // Debug
    this.globalDebug = debug;
    // User-agent
    this.globalUserAgent = userAgent;
    // Links
    this.globalBaseURL = 'https://www.google-analytics.com';
    this.globalDebugURL = '/debug';
    this.globalCollectURL = '/collect';
    this.globalBatchURL = '/batch';
    // Google generated ID
    this.globalTrackingID = trackingID;
    // Google API version
    this.globalVersion = version;
    this.customParams = {};
  }

  /**
   * Adds custom parameters to requests
   * if value is null, then parameter will be removed
   *
   * @param  {string} key     Parameter name
   * @param  {string} value   Parameter value
   */


  _createClass(Analytics, [{
    key: 'set',
    value: function set(key, value) {
      if (value !== null) {
        this.customParams[key] = value;
      } else {
        delete this.customParams[key];
      }
    }

    /**
     * Send a "pageview" request
     *
     * @param  {string} url      Url of the page
     * @param  {string} title    Title of the page
     * @param  {string} hostname Document hostname
     * @param  {string} clientID uuidV4
     *
     * @return {Promise}
     */

  }, {
    key: 'pageview',
    value: function pageview(hostname, url, title, clientID) {
      var params = { dh: hostname, dp: url, dt: title };
      return this.send('pageview', params, clientID);
    }

    /**
     * Send a "event" request
     *
     * @param  {string} evCategory Event category
     * @param  {string} evAction   Event action
     * @param  {string} clientID   uuidV4
     * @param  {string} evLabel    Event label
     * @param  {string} evValue    Event description
     *
     * @return {Promise}
     */

  }, {
    key: 'event',
    value: function event(evCategory, evAction) {
      var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          evLabel = _ref2.evLabel,
          evValue = _ref2.evValue,
          clientID = _ref2.clientID;

      var params = { ec: evCategory, ea: evAction };

      if (evLabel) params.el = evLabel;
      if (evValue) params.ev = evValue;

      return this.send('event', params, clientID);
    }

    /**
     * Send a "screenview" request
     *
     * @param  {string} appName        App name
     * @param  {string} appVer         App version
     * @param  {string} appID          App Id
     * @param  {string} appInstallerID App Installer Id
     * @param  {string} screenName     Screen name / Content description
     * @param  {string} clientID       uuidV4
     *
     * @return {Promise}
     */

  }, {
    key: 'screen',
    value: function screen(appName, appVer, appID, appInstallerID, screenName, clientID) {
      var params = {
        an: appName,
        av: appVer,
        aid: appID,
        aiid: appInstallerID,
        cd: screenName
      };

      return this.send('screenview', params, clientID);
    }

    /**
     * Send a "transaction" request
     *
     * @param  {string} trnID    Transaction ID
     * @param  {string} trnAffil Transaction affiliation
     * @param  {string} trnRev   Transaction Revenue
     * @param  {Number} trnShip  Transaction shipping
     * @param  {Number} trnTax   Transaction tax
     * @param  {string} currCode Currency code
     * @param  {string} clientID uuidV4
     *
     * @return {Promise}
     */

  }, {
    key: 'transaction',
    value: function transaction(trnID) {
      var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          trnAffil = _ref3.trnAffil,
          trnRev = _ref3.trnRev,
          trnShip = _ref3.trnShip,
          trnTax = _ref3.trnTax,
          currCode = _ref3.currCode;

      var clientID = arguments[2];

      var params = { ti: trnID };

      if (trnAffil) params.ta = trnAffil;
      if (trnRev) params.tr = trnRev;
      if (trnShip) params.ts = trnShip;
      if (trnTax) params.tt = trnTax;
      if (currCode) params.cu = currCode;

      return this.send('transaction', params, clientID);
    }

    /**
     * Send a "social" request
     *
     * @param  {string} socialAction  Social Action
     * @param  {string} socialNetwork Social Network
     * @param  {string} socialTarget  Social Target
     * @param  {string} clientID      uuidV4
     *
     * @return {Promise}
     */

  }, {
    key: 'social',
    value: function social(socialAction, socialNetwork, socialTarget, clientID) {
      var params = { sa: socialAction, sn: socialNetwork, st: socialTarget };

      return this.send('social', params, clientID);
    }

    /**
     * Send a "exception" request
     *
     * @param  {string} exDesc   Exception description
     * @param  {Number} exFatal  Exception is fatal?
     * @param  {string} clientID uuidV4
     *
     * @return {Promise}
     */

  }, {
    key: 'exception',
    value: function exception(exDesc, exFatal, clientID) {
      var params = { exd: exDesc, exf: exFatal };

      return this.send('exception', params, clientID);
    }

    /**
     * Send a "refund" request
     *
     * @param {string} trnID          Transaction ID
     * @param {string} evCategory     Event category
     * @param {string} evAction       Event action
     * @param {Number} nonInteraction Non-interaction parameter
     * @param {string} prdID          Product ID
     * @param {Number} prdQty         Product quantity
     * @param {string} clientID       uuidV4
     *
     * @returns {Promise}
     */

  }, {
    key: 'refund',
    value: function refund(trnID) {
      var evCategory = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Ecommerce';
      var evAction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Refund';
      var nonInteraction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

      var _ref4 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
          prdID = _ref4.prdID,
          prdQty = _ref4.prdQty;

      var clientID = arguments[5];

      var params = {
        ec: evCategory,
        ea: evAction,
        ni: nonInteraction,
        ti: trnID,
        pa: 'refund'
      };

      if (prdID) params.pr1id = prdID;
      if (prdQty) params.pr1qt = prdQty;

      return this.send('event', params, clientID);
    }

    /**
     * Send a "purchase" request
     * @param  {string} hostname      Document hostname
     * @param  {string} url           Url of the page
     * @param  {string} title         Title of the page
     * @param  {string} transactionID Transaction ID
     * @param  {string} trnAffil      Transaction affiliation
     * @param  {string} trnRev        Transaction Revenue
     * @param  {Number} trnTax        Transaction tax
     * @param  {Number} trnShip       Transaction shipping
     * @param  {string} trnCoupon     Transaction coupon
     * @param  {string} prdID         Product ID
     * @param  {string} prdName       Product name
     * @param  {string} prdCtg        Product category
     * @param  {string} prdBrand      Product brand
     * @param  {string} prdVar        Product variant
     * @param  {string} prdPos        Product position
     * @param  {string} clientID      uuidV4
     * @return {Promise}
     */

  }, {
    key: 'purchase',
    value: function purchase(hostname, url, title, transactionID) {
      var _ref5 = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
          trnAffil = _ref5.trnAffil,
          trnRev = _ref5.trnRev,
          trnTax = _ref5.trnTax,
          trnShip = _ref5.trnShip,
          trnCoupon = _ref5.trnCoupon,
          prdID = _ref5.prdID,
          prdName = _ref5.prdName,
          prdCtg = _ref5.prdCtg,
          prdBrand = _ref5.prdBrand,
          prdVar = _ref5.prdVar,
          prdPos = _ref5.prdPos;

      var clientID = arguments[5];

      var params = {
        dh: hostname,
        dp: url,
        dt: title,
        ti: transactionID,
        pa: 'purchase'
      };

      // Transaction params
      if (trnAffil) params.ta = trnAffil;
      if (trnRev) params.tr = trnRev;
      if (trnTax) params.tt = trnTax;
      if (trnShip) params.ts = trnShip;
      if (trnCoupon) params.tcc = trnCoupon;
      // Product params
      if (prdID) params.pr1id = prdID;
      if (prdName) params.pr1nm = prdName;
      if (prdCtg) params.pr1ca = prdCtg;
      if (prdBrand) params.pr1br = prdBrand;
      if (prdVar) params.pr1va = prdVar;
      if (prdPos) params.pr1p = prdPos;

      return this.send('pageview', params, clientID);
    }

    /**
     * Send a "checkout" request
     * @param  {string} hostname     Document hostname
     * @param  {string} url          Url of the page
     * @param  {string} title        Title of the page
     * @param  {string} checkoutStep Checkout step
     * @param  {string} checkoutOpt  Checkout step option
     * @param  {string} prdID        Product ID
     * @param  {string} prdName      Product name
     * @param  {string} prdCtg       Product category
     * @param  {string} prdBrand     Product brand
     * @param  {string} prdVar       Product variant
     * @param  {Number} prdPrice     Product price
     * @param  {Number} prdQty       Product category
     * @param  {string} clientID     uuidV4
     * @return {Promise}
     */

  }, {
    key: 'checkout',
    value: function checkout(hostname, url, title, checkoutStep, checkoutOpt) {
      var _ref6 = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {},
          prdID = _ref6.prdID,
          prdName = _ref6.prdName,
          prdCtg = _ref6.prdCtg,
          prdBrand = _ref6.prdBrand,
          prdVar = _ref6.prdVar,
          prdPrice = _ref6.prdPrice,
          prdQty = _ref6.prdQty;

      var clientID = arguments[6];

      var params = {
        dh: hostname,
        dp: url,
        dt: title,
        pa: 'checkout',
        cos: checkoutStep,
        col: checkoutOpt
      };

      if (prdID) params.pr1id = prdID;
      if (prdName) params.pr1nm = prdName;
      if (prdCtg) params.pr1ca = prdCtg;
      if (prdBrand) params.pr1br = prdBrand;
      if (prdVar) params.pr1va = prdVar;
      if (prdPrice) params.pr1pr = prdPrice;
      if (prdQty) params.pr1qt = prdQty;

      return this.send('pageview', params, clientID);
    }

    /**
     * Send a "checkout_option" request
     * @param  {string} evCategory   Event category
     * @param  {string} evAction     Event action
     * @param  {string} checkoutStep Checkout step
     * @param  {string} checkoutOpt  Checkout step option
     * @param  {string} clientID     uuidV4
     * @return {Promise}
     */

  }, {
    key: 'checkoutOpt',
    value: function checkoutOpt(evCategory, evAction, checkoutStep, _checkoutOpt, clientID) {
      var params = {
        ec: evCategory,
        ea: evAction,
        pa: 'checkout_option'
      };

      if (checkoutStep) params.cos = checkoutStep;
      if (_checkoutOpt) params.col = _checkoutOpt;

      return this.send('event', params, clientID);
    }

    /**
     * Send a "item" request
     * @param  {string} trnID         Transaction ID
     * @param  {string} itemName      Item name
     * @param  {Number} itemPrice     Item price
     * @param  {string} itemQty       Item quantity
     * @param  {string} itemSku       Item SKU
     * @param  {string} itemVariation Item variation / category
     * @param  {string} currCode      Currency code
     * @param  {string} clientID      uuidV4
     * @return {Promise}
     */

  }, {
    key: 'item',
    value: function item(trnID, itemName) {
      var _ref7 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
          itemPrice = _ref7.itemPrice,
          itemQty = _ref7.itemQty,
          itemSku = _ref7.itemSku,
          itemVariation = _ref7.itemVariation,
          currCode = _ref7.currCode;

      var clientID = arguments[3];

      var params = { ti: trnID, in: itemName };

      if (itemPrice) params.ip = itemPrice;
      if (itemQty) params.iq = itemQty;
      if (itemSku) params.ic = itemSku;
      if (itemVariation) params.iv = itemVariation;
      if (currCode) params.cu = currCode;

      return this.send('item', params, clientID);
    }

    /**
     * Send a "timing tracking" request
     * @param  {string} timingCtg     Timing category
     * @param  {string} timingVar     Timing variable
     * @param  {Number} timingTime    Timing time
     * @param  {string} timingLbl     Timing label
     * @param  {Number} dns           DNS load time
     * @param  {Number} pageDownTime  Page download time
     * @param  {Number} redirTime     Redirect time
     * @param  {Number} tcpConnTime   TCP connect time
     * @param  {Number} serverResTime Server response time
     * @param  {string} clientID      uuidV4
     * @return {Promise}
     */

  }, {
    key: 'timingTrk',
    value: function timingTrk(timingCtg, timingVar, timingTime) {
      var _ref8 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
          timingLbl = _ref8.timingLbl,
          dns = _ref8.dns,
          pageDownTime = _ref8.pageDownTime,
          redirTime = _ref8.redirTime,
          tcpConnTime = _ref8.tcpConnTime,
          serverResTime = _ref8.serverResTime;

      var clientID = arguments[4];

      var params = { utc: timingCtg, utv: timingVar, utt: timingTime };

      if (timingLbl) params.url = timingLbl;
      if (dns) params.dns = dns;
      if (pageDownTime) params.pdt = pageDownTime;
      if (redirTime) params.rrt = redirTime;
      if (tcpConnTime) params.tcp = tcpConnTime;
      if (serverResTime) params.srt = serverResTime;

      return this.send('timing', params, clientID);
    }

    /**
     * Send a request to google-analytics
     *
     * @param  {string} hitType  Hit type
     * @param  {string} clientID Unique identifier (uuidV4)
     * @param  {Object} params   Options
     *
     * @return {Promise}
     */

  }, {
    key: 'send',
    value: function send(hitType, params, clientID) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var formObj = {
          v: _this.globalVersion,
          tid: _this.globalTrackingID,
          cid: clientID || (0, _v2.default)(),
          t: hitType
        };
        if (params) Object.assign(formObj, params);

        if (Object.keys(_this.customParams).length > 0) {
          Object.assign(formObj, _this.customParams);
        }

        var url = '' + _this.globalBaseURL + _this.globalCollectURL;
        if (_this.globalDebug) {
          url = '' + _this.globalBaseURL + _this.globalDebugURL + _this.globalCollectURL;
        }

        return _axios2.default.post(url, _querystring2.default.stringify(formObj), {
          headers: _this.globalUserAgent !== '' ? { 'User-Agent': _this.globalUserAgent } : {}
        }).then(function (_ref9) {
          var data = _ref9.data,
              headers = _ref9.headers,
              status = _ref9.status;

          if (status === 200) {
            if (_this.globalDebug) {
              if (data.hitParsingResult[0].valid) {
                return resolve({ clientID: formObj.cid });
              }

              return reject(data);
            }
            return resolve({ clientID: formObj.cid });
          }

          if (headers['content-type'] !== 'image/gif') {
            return reject(data);
          }

          return reject(data);
        }).catch(function (error) {
          return reject(error);
        });
      });
    }
  }]);

  return Analytics;
}();

exports.default = Analytics;