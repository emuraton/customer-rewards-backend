import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import winston from 'winston';
import { INVALID_ACCOUNT_NUMBER } from './constants.js';

/** STUB DATA FILES **/
import customerEligibilityJSON from '../stub/data/customerEligibility.json';
import rewardsJSON from '../stub/data/rewards.json';

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
    res.json(getCustomeRewards(channelsSub));
  } else {
    res.json(JSON.parse([]));
  }
});

/** Get rewards corresponding to channels entry
  * @param {Array} channels : Customer channels
  */
function getCustomeRewards(channels){
  let rewardsByChannels = [];
  channels.map(channel => {
    const rewardItem = typeof rewardsJSON[channel.name] === undefined ? {} : rewardsJSON[channel.name];
    rewardsByChannels.push({'channel': channel, 'reward': rewardItem});
  });
  return rewardsByChannels;
}

/** Is customer eligible to get rewards
  * @param {String} accountNumber
  */
function getEligibilityService(accountNumber){
  let isEligible = customerEligibilityJSON[accountNumber];
  if(typeof isEligible === undefined) isEligible = {'error': INVALID_ACCOUNT_NUMBER};
  return isEligible;
}

const server = app.listen(3001, () => {
  logger.info('Listening at http://localhost:%s 🔥', 3001);
  logger.info('ENV = ',process.env.NODE_ENV);
});

module.exports = server;
