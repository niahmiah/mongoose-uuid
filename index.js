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
util.inherits(SchemaUUID, mongoose.SchemaTypes.Buffer);


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
 * Module exports.
 */

module.exports = SchemaUUID;
