import request from 'supertest';
import should from 'should';
import { getCustomerRewards, getEligibilityService } from '../src/utils';
import { INVALID_ACCOUNT_NUMBER } from '../src/constants';

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

  it('getEligibilityService should return true', done => {
    const trueEligible = getEligibilityService('123456');
    trueEligible.isEligible.should.equal(true);
    done();
  });

  it('getEligibilityService should return false', done => {
    const falseEligible = getEligibilityService('123457');
    falseEligible.isEligible.should.equal(false);
    done();
  });

  it('getEligibilityService should return an error', done => {
    const errorEligible = getEligibilityService('123458');
    errorEligible.error.should.equal("TECHNICAL_ERROR_EXCEPTION");
    done();
  });

  it('getCustomerRewards should return reward of "SPORTS"', done => {
    const rewards = getCustomerRewards([channelSports]);
    rewards[0].channel.id.should.equal(channelSports.id);
    rewards[0].reward.code.should.equal(rewardSports.code);
    done();
  });

  it('getCustomerRewards should return an empty object', done => {
    const rewards = getCustomerRewards(['NOT_A_CHANNEL']);
    rewards[0].should.be.empty;
    done();
  });
});
