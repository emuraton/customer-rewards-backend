import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import winston from 'winston';
import { INVALID_ACCOUNT_NUMBER } from './constants.js';
import { getCustomerRewards, getEligibilityService } from './utils.js';

const app = express();

/* Wintson logger into the console */
const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)()
  ]
});

app.use(cors());
app.use(helmet());
app.use(compression());

app.use(function(req, res, next){
  var data = "";
  req.on('data', function(chunk){ data += chunk})
  req.on('end', function(){
    req.rawBody = data;
    next();
  })
});

//TODO make it a get request
/** Route to get rewards of a customer
  * Body request {String} accountNumber, {Array} channelsSub
  */
app.post('/customer/rewards', function (req, res){
  const params = JSON.parse(req.rawBody);
  const accountNumber = params.accountNumber; // Customer account number
  const channelsSub = params.channelsSub; //Array of Map of channels subscriptions

  const rewards =  getEligibilityService(accountNumber);
  if(!rewards.error && rewards.isEligible){
    res.json(getCustomerRewards(channelsSub));
  } else {
    res.json(JSON.parse([]));
  }
});

const server = app.listen(3001, () => {
  logger.info('Listening at http://localhost:%s 🔥', 3001);
  logger.info('ENV = ',process.env.NODE_ENV);
});

module.exports = server;
