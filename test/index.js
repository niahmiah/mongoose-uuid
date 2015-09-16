var uuid = require('node-uuid');
var mongoose = require('mongoose');
var should = require('chai').should();
var Schema = mongoose.Schema;
// Will add the UUID type to the Mongoose Schema types
require('../index').loadType(mongoose);
var UUID = mongoose.Types.UUID;

// If you don't have the UUID variable declared you can use 'mongoose.Types.UUID'
var ProductSchema = Schema({
  someID: { type: UUID }
});

var Product = mongoose.model('Product', ProductSchema);

describe('mongoose-uuid', function(){
  it('should cast uuid strings to binary', function(){
    var product = new Product({ someID: '7c401d91-3852-4818-985d-7e7b79f771c3' });
    (product._doc.someID instanceof mongoose.Types.Buffer.Binary).should.equal(true);
  });

  it('should convert back to text with toObject()', function(){
    var product = new Product({ someID: '7c401d91-3852-4818-985d-7e7b79f771c3' });
    (product.someID).should.equal('7c401d91-3852-4818-985d-7e7b79f771c3');
  });
});
