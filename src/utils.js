/** STUB DATA FILES **/
import customerEligibilityJSON from '../stub/data/customerEligibility.json';
import rewardsJSON from '../stub/data/rewards.json';

/** Get rewards corresponding to channels entry
  * @param {Array} channels : Customer channels
  */
export function getCustomerRewards(channels){
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
export function getEligibilityService(accountNumber){
  let isEligible = customerEligibilityJSON[accountNumber];
  if(typeof isEligible === undefined) isEligible = {'error': INVALID_ACCOUNT_NUMBER};
  return isEligible;
}
