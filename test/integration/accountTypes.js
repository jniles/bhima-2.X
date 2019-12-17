/* global expect, agent */
/* eslint-disable no-unused-expressions */

const helpers = require('./helpers');

describe('(/accounts/types) Account Types', () => {
  const FETCHABLE_ACCOUNT_TYPE_ID = 1;
  const numAccountTypes = 16;

  it('GET /accounts/types returns a list of account type', () => {
    return agent.get('/accounts/types/')
      .then((res) => {
        helpers.api.listed(res, numAccountTypes);
      })
      .catch(helpers.handler);
  });

  it('GET /accounts/types/:id returns one account type', () => {
    return agent.get(`/accounts/types/${FETCHABLE_ACCOUNT_TYPE_ID}`)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.not.be.empty;
        expect(res.body.id).to.be.equal(FETCHABLE_ACCOUNT_TYPE_ID);
        expect(res.body).to.have.all.keys('id', 'type');
      })
      .catch(helpers.handler);
  });
});
