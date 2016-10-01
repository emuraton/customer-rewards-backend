var request = require('supertest');

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

describe('loading express', function () {
  var server;
  beforeEach(function () {
    server = require('../src/server');
  });
  afterEach(function () {
    server.close();
  });
  it('POST /customer/location responds with location:LONDON', function (done) {
    var customer = {'customerId': '123456'};
    request(server)
      .post('/customer/location')
      .send(customer)
      .expect(200, {
        location: 'LONDON',
      }, done);
  });

  it('POST /customer/location : customer without location', function (done) {
    var customer = {'customerId': '123458'};
    request(server)
      .post('/customer/location')
      .send(customer)
      .expect(200, {}, done);
  });

  it('POST /customer/location : not a customer id', function (done) {
    var customer = {'customerId': 'NOT_AN_ID'};
    request(server)
      .post('/customer/location')
      .send(customer)
      .expect(200, {
        location: 'NOT_FOUND',
      }, done);
  });


  it('POST /channels/packages : channels for london', function (done) {
    var customerLocation = {'customerLocation': 'LONDON'};
    request(server)
      .post('/channels/packages')
      .send(customerLocation)
      .expect(200, JSON.parse(stubLondonResponse), done);
  });
});
