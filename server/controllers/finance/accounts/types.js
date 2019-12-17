/**
 * @overview AccountTypes
 *
 * @description
 * Implements CRUD operations on the account_type table.
 *
 * This module implements the following routes:
 *  GET    /accounts/types
 *  GET    /accounts/types/:id
 *
 * @requires db
 * @requires NotFound
 */

const db = require('../../../lib/db');

/**
 * @method detail
 *
 * @description
 * Retrieves a single account type item from the database
 *
 * GET /accounts/types/:id
 */
async function detail(req, res, next) {
  try {
    const row = await lookupAccountType(req.params.id);
    res.status(200).json(row);
  } catch (e) {
    next(e);
  }
}

/**
 * @method list
 *
 * @description
 * Lists all recorded account type entities.
 *
 * GET /accounts/types
 */
async function list(req, res, next) {
  try {
    const sql = 'SELECT `id`, `type`, `translation_key` FROM account_type;';
    const rows = await db.exec(sql);
    res.status(200).json(rows);
  } catch (e) {
    next(e);
  }
}

/**
 * @method lookupAccountType
 *
 * @description
 * Retrieves an account type by id.  If none matches, throws a NotFound error.
 *
 * @param {Number} id - the id of the account type
 * @returns {Promise} - a promise resolving to the result of the database.
 */
function lookupAccountType(id) {
  const sql = 'SELECT at.id, at.type FROM account_type AS at WHERE at.id = ?;';
  return db.one(sql, id);
}

exports.list = list;
exports.detail = detail;
