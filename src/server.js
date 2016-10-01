import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import winston from 'winston';

/** STUB DATA FILES **/
import customersJSON from '../stub/data/customers.json';
import channelsPackagesJSON from '../stub/data/channelsPackages.json';

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


/**
  * Find the location of the customer by his ID. If the id not know, answer 'NOT_FOUND'.
  */
app.post('/customer/location', function (req, res) {
  let customerId = JSON.parse(req.rawBody).customerId;
  if(customersJSON[customerId]) {
    res.json(customersJSON[customerId]);
  } else {
    logger.error('Error finding location of customer: ', customerId);
    res.json({'location': 'NOT_FOUND'});
  }
});

/**
  * Get channels package.
  */
app.post('/channels/packages', function (req, res) {
  /*
   * Code to return the right package.
   */
  const stubLondonResponse =`
    {
      "channelsPackages":
      [
        {
          "category": "sports",
          "channels": [
            {
              "id": "arsenal-tv-london",
              "name": "Arsenal TV"
            },
            {
              "id": "chelsea-tv-london",
              "name": "Chelsea TV"
            }
          ]
        },
        {
          "category": "news",
          "channels": [
            {
              "id": "sky-news-news",
              "category": "news",
              "name": "Sky News"
            },
            {
              "id": "sky-sports-news-news",
              "name": "Sky Sports News"
            }
          ]
        },
        {
          "category": "basket",
          "channels": [
            {
              "id": "arsenal-tv-basket",
              "location": "london",
              "name": "Arsenal TV"
            },
            {
              "id": "sky-sports-basket",
              "name": "Sky Sports News"
            }
          ]
        }
      ]
    }
  `;

  res.json(JSON.parse(stubLondonResponse));
});

const server = app.listen(3001, () => {
  logger.info('Listening at http://localhost:%s 🔥', 3001);
  logger.info('ENV = ',process.env.NODE_ENV);
});

module.exports = server;
