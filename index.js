'use strict';
/*!
 * Module requirements.
 */
var mongoose = require('mongoose');
var bson = require('bson');
var util = require('util');
var uuid = require('node-uuid');

function getter (binary){
  if(!binary) return '';
  var len = binary.length();

  var b = binary.read(0,len);

  var buf = new Buffer(len);

  for (var i = 0; i < len; i++)
    buf[i] = b[i];

  var hex = '';

  for (var i = 0; i < len; i++)
  {
    var n = buf.readUInt8(i);
    if (n < 16)
      hex += '0'+n.toString(16);
    else
      hex += n.toString(16);
  }

  var uuidStr = hex.substr(0, 8) + '-' + hex.substr(8, 4) + '-' + hex.substr(12, 4) + '-' + hex.substr(16, 4) + '-' + hex.substr(20, 12);
  return uuidStr;
}

function SchemaUUID(path, options){
  mongoose.SchemaTypes.Buffer.call(this, path, options);
  this.getters.push(getter);
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
  return value instanceof mongoose.Types.Buffer.Binary;
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

  if (value instanceof mongoose.Types.Buffer.Binary)
    return value;

  var uuidBuffer;

  // support for timestamps
  if (typeof value !== 'undefined') {
    if (typeof value === 'string') {
      // support for uuid strings
      uuidBuffer = new mongoose.Types.Buffer(uuid.parse(value));
      uuidBuffer.subtype(bson.SUBTYPE_UUID);
      return uuidBuffer.toObject();
    }
  }

  throw new Error('Could not cast ' + value + ' to uuid.');
};

SchemaUUID.prototype.castForQuery = function ($conditional, val) {
  var handler;
  if (arguments.length === 2) {
    handler = this.$conditionalHandlers[$conditional];
    if (!handler)
      throw new Error("Can't use " + $conditional + " with Buffer.");
    return handler.call(this, val);
  } else {
    val = $conditional;
    return this.cast(val);
  }
};

module.exports.loadType = function loadType(mongoose){
  mongoose.Types.UUID = mongoose.SchemaTypes.UUID = SchemaUUID;
}
