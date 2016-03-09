/* jshint expr: true */
/* global describe, it, beforeEach */

var chai = require('chai');
var expect = chai.expect;

var helpers = require('./helpers');
var uuid    = require('node-uuid');
helpers.configure(chai);

describe('The /debtor_groups HTTP API ENDPOINT', function () {
  var agent = chai.request.agent(helpers.baseUrl);

  var debtorGroup = {
    enterprise_id : 1,
    uuid : uuid(),
    name : 'New Debtor Group (Test)',
    account_id : 3638,
    location_id : '03a329b2-03fe-4f73-b40f-56a2870cc7e6',
    phone : '0811838662',
    email : 'debtorgroup@info.com',
    note : 'Nouveau debtor group de test',
    locked : 0,
    max_credit : null,
    is_convention : 0,
    price_list_uuid : null,
    apply_discounts : 0,
    apply_billing_services : 0,
    apply_subsidies : 0
  };

  var updateGroup = {
    enterprise_id : 1,
    name : 'Updated Debtor Group (Test)',
    account_id : 3638,
    location_id : '03b44338-a38b-4450-b12d-3acc4f3d3465',
    phone : '0818061031',
    email : 'update@info.com',
    note : 'Updated debtor group de test',
    locked : 1,
    max_credit : 1000,
    is_convention : 1,
    price_list_uuid : '2e39c855-6f2b-48d7-af7f-746f0552f7bf',
    apply_discounts : 1,
    apply_billing_services : 1,
    apply_subsidies : 1
  };

  var lockedGroup = {
    enterprise_id : 1,
    uuid : uuid(),
    name : 'Locked Debtor Group (Test)',
    account_id : 3638,
    location_id : '03a329b2-03fe-4f73-b40f-56a2870cc7e6',
    phone : '0811838662',
    email : 'debtorgroup@info.com',
    note : 'Nouveau debtor group de test',
    locked : 1,
    max_credit : null,
    is_convention : 0,
    price_list_uuid : null,
    apply_discounts : 0,
    apply_billing_services : 0,
    apply_subsidies : 0
  };

  var conventionGroup = {
    enterprise_id : 1,
    uuid : uuid(),
    name : 'Convention Debtor Group (Test)',
    account_id : 3638,
    location_id : '03a329b2-03fe-4f73-b40f-56a2870cc7e6',
    phone : '0811838662',
    email : 'debtorgroup@info.com',
    note : 'Nouveau debtor group de test',
    locked : 0,
    max_credit : null,
    is_convention : 1,
    price_list_uuid : null,
    apply_discounts : 0,
    apply_billing_services : 0,
    apply_subsidies : 0
  };

  var lockedConventionGroup = {
    enterprise_id : 1,
    uuid : uuid(),
    name : 'Locked Convention Debtor Group (Test)',
    account_id : 3638,
    location_id : '03a329b2-03fe-4f73-b40f-56a2870cc7e6',
    phone : '0811838662',
    email : 'debtorgroup@info.com',
    note : 'Nouveau debtor group de test',
    locked : 1,
    max_credit : null,
    is_convention : 1,
    price_list_uuid : null,
    apply_discounts : 0,
    apply_billing_services : 0,
    apply_subsidies : 0
  };

  var invalidGroup = {
    enterprise_id : 1,
    name : 'Invalid Debtor Group (Test)',
    location_id : '03a329b2-03fe-4f73-b40f-56a2870cc7e6',
    phone : '0811838662',
    email : 'debtorgroup@info.com',
    note : 'Nouveau debtor group de test'
  };

  var allDebtorGroups;

  // Logs in before each test
  beforeEach(helpers.login(agent));

  it('POST /debtor_groups/ create a new debtor group (unlocked)', function () {
    return agent.post('/debtor_groups/')
    .send(debtorGroup)
    .then(function (res) {
      expect(res).to.have.status(201);
      expect(res.body.id).to.exist;
      expect(res.body.id).to.be.equal(debtorGroup.uuid);
    })
    .catch(helpers.handler);
  });

  it('POST /debtor_groups/ create a new debtor group (locked)', function () {
    return agent.post('/debtor_groups/')
    .send(lockedGroup)
    .then(function (res) {
      expect(res).to.have.status(201);
      expect(res.body.id).to.exist;
      expect(res.body.id).to.be.equal(lockedGroup.uuid);
    })
    .catch(helpers.handler);
  });

  it('POST /debtor_groups/ create a new debtor group (convention)', function () {
    return agent.post('/debtor_groups/')
    .send(conventionGroup)
    .then(function (res) {
      expect(res).to.have.status(201);
      expect(res.body.id).to.exist;
      expect(res.body.id).to.be.equal(conventionGroup.uuid);
    })
    .catch(helpers.handler);
  });

  it('POST /debtor_groups/ create a new debtor group (locked convention)', function () {
    return agent.post('/debtor_groups/')
    .send(lockedConventionGroup)
    .then(function (res) {
      expect(res).to.have.status(201);
      expect(res.body.id).to.exist;
      expect(res.body.id).to.be.equal(lockedConventionGroup.uuid);
    })
    .catch(helpers.handler);
  });

  it('POST /debtor_groups/ dont create when with missing data', function () {
    return agent.post('/debtor_groups/')
    .send(invalidGroup)
    .then(function (res) {
      expect(res).to.have.status(400);
      expect(res.body.code).to.exist;
      expect(res.body.code).to.be.equal('ERR_MISSING_REQUIRED_PARAMETERS');
    })
    .catch(helpers.handler);
  });

  it('GET /debtor_groups returns a list of debtor groups', function () {
    return agent.get('/debtor_groups')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.not.be.empty;
        allDebtorGroups = res.body;
      })
      .catch(helpers.handler);
  });

  it('GET /debtor_groups/:uuid returns all details for a valid debtor group', function () {
    return agent.get('/debtor_groups/' + debtorGroup.uuid)
      .then(function (res) {
        var expectedKeySubset = ['uuid', 'account_id', 'name', 'location_id', 'is_convention'];
        expect(res).to.have.status(200);
        expect(res.body).to.contain.all.keys(expectedKeySubset);
      })
      .catch(helpers.handler);
  });

  it('GET /debtor_groups/invalid returns NOT FOUND (404) for invalid id', function () {
    return agent.get('/debtor_groups/invalid')
      .then(function (res) {
        expect(res).to.have.status(404);
        expect(res.body).to.not.be.empty;
        expect(res.body.code).to.exist;
        expect(res.body.code).to.be.equal('ERR_NOT_FOUND');
      })
      .catch(helpers.handler);
  });

  it('GET /debtor_groups/?locked={1|0} returns only locked or not locked debtor groups', function () {
    var totalLockedGroup = getTotal(allDebtorGroups, 'locked', 1);
    var totalUnlockedGroup = getTotal(allDebtorGroups, 'locked', 0);

    return agent.get('/debtor_groups/?locked=1')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.not.be.empty;
        expect(res.body).to.have.length(totalLockedGroup);
        expect(res.body[0].locked).to.exist;
        expect(res.body[0].locked).to.be.equal(1);
        return agent.get('/debtor_groups/?locked=0');
      })
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.not.be.empty;
        expect(res.body).to.have.length(totalUnlockedGroup);
        expect(res.body[0].locked).to.exist;
        expect(res.body[0].locked).to.be.equal(0);
      })
      .catch(helpers.handler);
  });

  it('GET /debtor_groups/?is_convention={1|0} returns only conventions or not conventions debtor groups', function () {
    var totalConvention = getTotal(allDebtorGroups, 'is_convention', 1);
    var totalNotConvention = getTotal(allDebtorGroups, 'is_convention', 0);

    return agent.get('/debtor_groups/?is_convention=1')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.not.be.empty;
        expect(res.body).to.have.length(totalConvention);
        expect(res.body[0].is_convention).to.exist;
        expect(res.body[0].is_convention).to.be.equal(1);
        return agent.get('/debtor_groups/?is_convention=0');
      })
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.not.be.empty;
        expect(res.body).to.have.length(totalNotConvention);
        expect(res.body[0].is_convention).to.exist;
        expect(res.body[0].is_convention).to.be.equal(0);
      })
      .catch(helpers.handler);
  });

  it('GET /debtor_groups/?locked={1|0}&is_convention={1|0} returns either  locked or convention debtor groups', function () {
    return agent.get('/debtor_groups/?locked=1&is_convention=1')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.not.be.empty;
        expect(res.body[0].locked).to.exist;
        expect(res.body[0].locked).to.be.equal(1);
        expect(res.body[0].is_convention).to.exist;
        expect(res.body[0].is_convention).to.be.equal(1);
        return agent.get('/debtor_groups/?locked=1&is_convention=0');
      })
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.not.be.empty;
        expect(res.body[0].locked).to.exist;
        expect(res.body[0].locked).to.be.equal(1);
        expect(res.body[0].is_convention).to.exist;
        expect(res.body[0].is_convention).to.be.equal(0);
        return agent.get('/debtor_groups/?locked=0&is_convention=1');
      })
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.not.be.empty;
        expect(res.body[0].locked).to.exist;
        expect(res.body[0].locked).to.be.equal(0);
        expect(res.body[0].is_convention).to.exist;
        expect(res.body[0].is_convention).to.be.equal(1);
        return agent.get('/debtor_groups/?locked=0&is_convention=0');
      })
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res.body).to.not.be.empty;
        expect(res.body[0].locked).to.exist;
        expect(res.body[0].locked).to.be.equal(0);
        expect(res.body[0].is_convention).to.exist;
        expect(res.body[0].is_convention).to.be.equal(0);
      })
      .catch(helpers.handler);
  });

  it('PUT /debtor_groups/ update a debtor group', function () {
    return agent.put('/debtor_groups/' + debtorGroup.uuid)
    .send(updateGroup)
    .then(function (res) {
      updateGroup.uuid = debtorGroup.uuid;
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.deep.equal(updateGroup);
    })
    .catch(helpers.handler);
  });

  /**
  * @function getTotal
  *
  * @desc Get number of element in {array} by criteria and value
  *
  * @param {array} array The array of objects
  * @param {string} criteria A property of item in {array}
  * @param {mixed} value A value of the property
  *
  */
  function getTotal(array, criteria, value) {
    return array.filter(function (item) {
      return item[criteria] == value;
    }).length;
  }

  it('GET /debtor_groups/:uuid/invoices returns all invoices for a debtor group', function () {
    return agent.get('/debtor_groups/' + debtorGroup.uuid + '/invoices')
      .then(function (res) {
        expect(res).to.have.status(200);
      })
      .catch(helpers.handler);
  });

  it('GET /debtor_groups/unknow/invoices returns a NOT FOUND (404) for an unknow {uuid}', function () {
    return agent.get('/debtor_groups/unknow/invoices')
      .then(function (res) {
        expect(res).to.have.status(404);
      })
      .catch(helpers.handler);
  });

  it('GET /debtor_groups/:uuid/invoices returns only balanced invoices for a debtor group', function () {
    return agent.get('/debtor_groups/' + debtorGroup.uuid + '/invoices?balanced=1')
      .then(function (res) {
        expect(res).to.have.status(200);
      })
      .catch(helpers.handler);
  });

});
