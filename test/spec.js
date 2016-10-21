import request from 'supertest';
import should from 'should';

describe('customer rewards', () => {
  let server;
  beforeEach(() => {
    server = require('../src/server');
  });
  afterEach(() => {
    server.close();
  });

  const channelSports = {'id': '1', 'name': 'SPORTS'};
  const channelKids = {'id': '2', 'name': 'KIDS'};
  const rewardSports = {
    'code': 'CHAMPIONS_LEAGUE_FINAL_TICKET',
  };

  it("POST /customer/rewards responds with one reward ", done => {
    const params = {
      accountNumber: '123456',
      channelsSub: [channelSports]
    };
    request(server)
      .post('/customer/rewards')
      .send(params)
      .expect(200)
      .end((err, res) =>{
        res.body[0].channel.id.should.equal(channelSports.id);
        res.body[0].channel.name.should.equal(channelSports.name);
        res.body[0].reward.code.should.equal(rewardSports.code);
        done();
      });
  });

  it('POST /customer/rewards responds with an empty reward ', done => {
    const params = {
      accountNumber: '123456',
      channelsSub: [channelKids]
    };
    request(server)
      .post('/customer/rewards')
      .send(params)
      .expect(200)
      .end((err, res) =>{
        res.body[0].reward.should.be.empty;
        done();
      });
  });
});
