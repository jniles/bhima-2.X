/**
 * @overview AccountCategories
 *
 * @description
 * Implements CRUD operations on the account_category entity.
 *
 * This module implements the following routes:
 *  GET    /accounts/categories
 *  GET    /accounts/categories/:id
 *
 * @requires db
 * @requires NotFound
 */

const db = require('../../../lib/db');

/**
 * @method detail
 *
 * @description
 * Retrieves a single account category item from the database
 *
 * GET /accounts/categories/:id
 */
async function detail(req, res, next) {
  try {
    const row = await lookupAccountCategory(req.params.id);
    res.status(200).json(row);
  } catch (e) {
    next(e);
  }
}

/**
 * @method list
 *
 * @description
 * Lists all recorded account category entities.
 *
 * GET /accounts/categories
 */
async function list(req, res, next) {
  const sql = `
    SELECT id, category, translation_key FROM account_category;
  `;

  try {
    const rows = await db.exec(sql);
    res.status(200).json(rows);
  } catch (e) {
    next(e);
  }
}

/**
 * @method lookupAccountCategory
 *
 * @description
 * Retrieves an account category by id.  If none matches, throws a NotFound error.
 *
 * @param {Number} id - the id of the account category
 * @returns {Promise} - a promise resolving to the result of the database.
 */
function lookupAccountCategory(id) {
  const sql = 'SELECT ac.id, ac.category FROM account_category AS ac WHERE ac.id = ?;';
  return db.one(sql, id);
}

exports.list = list;
exports.detail = detail;
