/* global expect, agent */
/* eslint-disable no-unused-expressions */

const helpers = require('./helpers');

describe('(/accounts/categories) Account Categories', () => {
  const FETCHABLE_ACCOUNT_TYPE_ID = 1;
  const numAccountCategory = 6;

  it('GET /accounts/categories returns a list of account category', () => {
    return agent.get('/accounts/categories/')
      .then((res) => {
        helpers.api.listed(res, numAccountCategory);
      })
      .catch(helpers.handler);
  });

  it('GET /accounts/categories/:id returns one account category', () => {
    return agent.get(`/accounts/categories/${FETCHABLE_ACCOUNT_TYPE_ID}`)
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.not.be.empty;
        expect(res.body.id).to.be.equal(FETCHABLE_ACCOUNT_TYPE_ID);
        expect(res.body).to.have.all.keys('id', 'category');
      })
      .catch(helpers.handler);
  });
});
