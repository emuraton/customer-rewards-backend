var request = require('supertest');

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
      .expect(200, {
        location: 'NOT_FOUND',
      }, done);
  });

  it('POST /customer/location : customer without location', function (done) {
    var customer = {'customerId': 'NOT_AN_ID'};
    request(server)
      .post('/customer/location')
      .send(customer)
      .expect(200, {
        location: 'NOT_FOUND',
      }, done);
  });
});
