var q = require('q');
var db = require('./../../lib/db');
var uuid = require('./../../lib/guid');
var journal = require('./journal');



/** 
 * Utility method to ensure purchase items lines reference purchase.
 * @param {Object} purchaseItems - An Array of all purchase items to be written 
 * @param {string} purchaseUuid - UUID of referenced purchase order
 * @returns {Object} An Array of all purchases items with guaranteed UUIDs and Purchase orders references
 */
function linkPurchaseItems(purchaseItems, purchaseUuid) { 
  return purchaseItems.map(function (purchaseItem) { 
     
    purchaseItem.uuid = purchaseItem.uuid || uuid();
    purchaseItem.purchase_uuid = purchaseUuid;
   
    // Collapse sale item into Array to be inserted into database
    return Object.keys(purchaseItem).map(function (key) { 
      return purchaseItem[key];
    });
  });
}


/**
* Create a Purchase Order in the database
*
**/

function create (req, res, next) {
  'use strict';

  var purchase = req.body;
  var transaction;  
  var purchaseOrder = purchase.purchase_order;
  var purchaseItem =  purchase.purchase_item;

  // Reject invalid parameters
  if (!purchaseItem || !purchaseItem) { 
    res.status(400).json({
      code : 'ERROR.ERR_MISSING_INFO', 
      reason : 'A valid sale details and sale items must be provided under the attributes `sale` and `saleItems`'
    });
    return;
  }
  


  var sqlPurchase = 'INSERT INTO purchase SET ?';

  var sqlPurchaseItem = 'INSERT INTO purchase_item (uuid, inventory_uuid, quantity, unit_price, ' +
    'total, purchase_uuid) VALUES ?'; 

  var dataPurchaseItem = linkPurchaseItems(purchase.purchase_item, purchaseOrder.uuid);

  transaction = db.transaction();

  transaction
    .addQuery(sqlPurchase, [purchaseOrder])
    .addQuery(sqlPurchaseItem,[linkPurchaseItems(purchaseItem, purchaseOrder.uuid)]);

  transaction.execute()
    .then(function (results) {
      var confirmation =  { 
        uuid : purchaseOrder.uuid,
        results : results
      };

      res.status(201).json(confirmation);
      return;
    })
    .catch(next)
    .done();
}


/**
* GET /projects/
*
* Returns the details of a single project
*/
function list (req, res, next) {
  'use strict';
  var sql;

  sql =
    'SELECT purchase.uuid, purchase.reference, purchase.cost, purchase.discount, purchase.purchase_date, purchase.paid, ' +
    'creditor.text, employee.name, employee.prenom, user.first, user.last ' +
    'FROM purchase ' +
    'JOIN creditor ON creditor.uuid = purchase.creditor_uuid ' +
    'JOIN employee ON employee.id = purchase.purchaser_id ' +
    'JOIN user ON user.id = purchase.emitter_id; ';

  if (req.query.complete === '1') {
    sql =  
      'SELECT purchase.uuid, purchase.reference, purchase.cost, purchase.discount, purchase.purchase_date, purchase.paid, ' +
      'creditor.text, employee.name, employee.prenom, user.first, user.last, ' +
      'purchase.creditor_uuid, purchase.timestamp, purchase.note, purchase.paid_uuid, purchase.confirmed, purchase.closed, ' +
      'purchase.is_direct, purchase.is_donation, purchase.emitter_id, purchase.is_authorized, purchase.is_validate, ' +
      'purchase.confirmed_by, purchase.is_integration, purchase.purchaser_id, purchase.receiver_id ' +
      'FROM purchase ' +
      'JOIN creditor ON creditor.uuid = purchase.creditor_uuid ' +
      'JOIN employee ON employee.id = purchase.purchaser_id ' +
      'JOIN user ON user.id = purchase.emitter_id; ';
  }

  db.exec(sql)
  .then(function (rows) {
    res.status(200).json(rows);
  })
  .catch(next)
  .done();
}

function detail (req, res, next) {
  'use strict';

  var purchaseUuid = req.params.uuid,
    purchaseRow, purchaseItems;

  var sqlPurchase =
    'SELECT purchase.uuid, purchase.reference, purchase.cost, purchase.discount, purchase.purchase_date, purchase.paid, ' +
    'creditor.text, employee.name, employee.prenom, user.first, user.last ' +
    'FROM purchase ' +
    'JOIN creditor ON creditor.uuid = purchase.creditor_uuid ' +
    'JOIN employee ON employee.id = purchase.purchaser_id ' +
    'JOIN user ON user.id = purchase.emitter_id ' +
    'WHERE purchase.uuid = ?';

  var sqlPurchaseItem =
    'SELECT purchase_item.purchase_uuid, purchase_item.uuid, purchase_item.quantity, purchase_item.unit_price, ' +
    'purchase_item.total, inventory.text ' +
    'FROM purchase_item ' +
    'JOIN inventory ON inventory.uuid = purchase_item.inventory_uuid ' +
    'WHERE purchase_item.purchase_uuid = ? ';  

  db.exec(sqlPurchase, [purchaseUuid])
  .then(function (row) {
    purchaseRow = row;
    return db.exec(sqlPurchaseItem, [purchaseUuid]);
  })
  .then(function (rows) {     
    if (purchaseRow.length === 0) { 
      res.status(404).json({
        code : 'ERR_NOT_FOUND', 
        reason : 'No Purchase found under the uuid ' + purchaseUuid
      });
    } else {       
      // Found Purchase resource - unpack and return to client
      purchaseItems = rows;
      res.status(200).json({
        purchase : purchaseRow, 
        purchaseItems : purchaseItems
      });
    }
  })  
  .catch(next)
  .done();
}


// PUT /purchase/:uuid
function update(req, res, next) {
  'use strict';

  var sql;

  sql =
    'UPDATE purchase SET ? WHERE uuid = ?;';

  db.exec(sql, [req.body, req.params.uuid])
  .then(function () {

    sql =
      'SELECT purchase.uuid, purchase.reference, purchase.cost, purchase.discount, purchase.purchase_date, purchase.paid, ' +
      'creditor.text, employee.name, employee.prenom, user.first, user.last, ' +
      'purchase.creditor_uuid, purchase.timestamp, purchase.note, purchase.paid_uuid, purchase.confirmed, purchase.closed, ' +
      'purchase.is_direct, purchase.is_donation, purchase.emitter_id, purchase.is_authorized, purchase.is_validate, ' +
      'purchase.confirmed_by, purchase.is_integration, purchase.purchaser_id, purchase.receiver_id ' +
      'FROM purchase ' +
      'JOIN creditor ON creditor.uuid = purchase.creditor_uuid ' +
      'JOIN employee ON employee.id = purchase.purchaser_id ' +
      'JOIN user ON user.id = purchase.emitter_id ' +
      'WHERE purchase.uuid = ? ;';


    return db.exec(sql, [req.params.uuid]);
  })
  .then(function (rows) {
    if (rows.length === 0) {
      throw new req.codes.ERR_NOT_FOUND();
    }

    res.status(200).json(rows[0]);
  })
  .catch(next)
  .done();
}



// create a new purchase order
exports.create = create;

//Read all purchase order
exports.list = list;

// Read a specific purchase order
exports.detail = detail;

//Update properties of a purchase Order 
exports.update = update; 