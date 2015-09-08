'use strict';
/*!
 * Module requirements.
 */
var mongoose = require('mongoose');
var util = require('util');
var uuid = require('node-uuid');

module.exports.loadType = function loadType(mongoose){
  mongoose.Types.UUID = mongoose.SchemaTypes.UUID = SchemaUUID;
}

function SchemaUUID(path, options){
  mongoose.SchemaTypes.Buffer.call(this, path, options);
}

/*!
 * Inherits from SchemaType.
 */
util.inherits(Currency, mongoose.SchemaTypes.Buffer);


SchemaUUID.schemaName = 'UUID';
/**
 * Required validator for uuid
 *
 * @api private
 */

SchemaUUID.prototype.checkRequired = function (value) {
  return value instanceof Array;
};

/**
 * Casts to uuid
 *
 * @param {Object} value to cast
 * @api private
 */

SchemaUUID.prototype.cast = function (value) {
  // If null or undefined
  if (value == null || value === '')
    return value;

  if (value instanceof Array && value.lenth === 16)
    return value;

  var uuidBuffer;

  // support for timestamps
  if (typeof value !== 'undefined') {
    if (typeof value === 'string') {
      // support for uuid strings
      uuidBuffer = uuid.parse(value);
    }
  }

  throw new Error('Could not cast ' + value + 'to uuid buffer.');
};

/*!
 * UUID Query casting.
 *
 * @api private
 */

function handleSingle (val) {
  return this.cast(val);
}

function handleArray (val) {
  var self = this;
  if (!Array.isArray(val)) {
    return [this.cast(val)];
  }
  return val.map( function (m) {
    return self.cast(m);
  });
}

SchemaUUID.prototype.$conditionalHandlers =
  utils.options(SchemaType.prototype.$conditionalHandlers, {
    '$all': handleArray,
    '$gt': handleSingle,
    '$gte': handleSingle,
    '$in': handleArray,
    '$lt': handleSingle,
    '$lte': handleSingle,
    '$ne': handleSingle,
    '$nin': handleArray
  });


/**
 * Casts contents for queries.
 *
 * @param {String} $conditional
 * @param {any} [value]
 * @api private
 */

SchemaUUID.prototype.castForQuery = function ($conditional, val) {
  var handler;

  if (2 !== arguments.length) {
    return this.cast($conditional);
  }

  handler = this.$conditionalHandlers[$conditional];

  if (!handler) {
    throw new Error("Can't use " + $conditional + " with UUID.");
  }

  return handler.call(this, val);
};

/*!
 * Module exports.
 */

module.exports = SchemaUUID;
