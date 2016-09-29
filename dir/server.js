'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _customers = require('../stub/data/customers.json');

var _customers2 = _interopRequireDefault(_customers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

/* Wintson logger into the console */


/** STUB DATA FILES **/
var logger = new _winston2.default.Logger({
  transports: [new _winston2.default.transports.Console()]
});

app.use((0, _cors2.default)());
app.use((0, _helmet2.default)());
app.use((0, _compression2.default)());

app.use(function (req, res, next) {
  var data = "";
  req.on('data', function (chunk) {
    data += chunk;
  });
  req.on('end', function () {
    req.rawBody = data;
    next();
  });
});

/**
  * Find the location of the customer by his ID. If the id not know, answer 'NOT_FOUND'.
  */
app.post('/customer/location', function (req, res) {
  var customerId = JSON.parse(req.rawBody).customerId;

  if (customerId) {
    res.json(_customers2.default[customerId]);
  } else {
    logger.error('Error finding location of customer: ', customerId);
    res.json({ customerId: 'NOT_FOUND' });
  }
});

var server = app.listen(3001, function () {
  logger.info('Listening at http://localhost:%s 🔥', 3001);
  logger.info('ENV = ', process.env.NODE_ENV);
});