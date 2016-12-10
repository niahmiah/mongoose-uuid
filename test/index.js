var uuid = require('node-uuid');
var mongoose = require('mongoose');
var should = require('chai').should();
var Schema = mongoose.Schema;
// Will add the UUID type to the Mongoose Schema types
require('../index').loadType(mongoose);
var UUID = mongoose.Types.UUID;

var ProductSchema = Schema({
  _id: { type: UUID, default: uuid.v4 },
  name: String
}, { id: false });

var PhotoSchema = Schema({
  _id: { type: UUID, default: uuid.v4 },
  filename: String,
  product: { type: UUID, ref: 'Product' }
}, { id: false });

ProductSchema.set('toObject', {getters: true});
ProductSchema.set('toJSON', {getters: true});

var Product = mongoose.model('Product', ProductSchema);

PhotoSchema.set('toObject', {getters: true});
PhotoSchema.set('toJSON', {getters: true});

var Photo = mongoose.model('Photo', PhotoSchema);

describe('mongoose-uuid', function(){
  before(function() {
    return mongoose.connect('mongodb://localhost:27017/mongoose-uuid-test')
  })

  after(function(cb) {
    Product.remove({}, function() {
      mongoose.disconnect(cb);
    });
  });

  it('should cast uuid strings to binary', function(){
    var product = new Product({
      _id: '7c401d91-3852-4818-985d-7e7b79f771c3',
      name: 'Some product'
    });
    (product._doc._id instanceof mongoose.Types.Buffer.Binary).should.equal(true);
  });

  it('should convert back to text with toObject()', function(){
    var product = new Product({
      _id: '7c401d91-3852-4818-985d-7e7b79f771c3',
      name: 'Some product'
    });
    var productObject = product.toObject();
    (productObject._id).should.equal('7c401d91-3852-4818-985d-7e7b79f771c3');
  });

  it('should save without errors', function(cb) {
    var product = new Product({
      _id: '7c401d91-3852-4818-985d-7e7b79f771c3',
      name: 'Some product'
    });
    product.save(cb);
  });

  it('should be found correctly with .find()', function(cb) {
    Product.findOne({_id: '7c401d91-3852-4818-985d-7e7b79f771c3'}, function(err, product) {
      (product).should.not.be.null;
      var productObject = product.toObject();
      (productObject._id).should.equal('7c401d91-3852-4818-985d-7e7b79f771c3');
      cb(err);
    });
  });

  it('should be found correctly with .findById()', function(cb) {
    Product.findById('7c401d91-3852-4818-985d-7e7b79f771c3', function(err, product) {
      (product).should.not.be.null;
      var productObject = product.toObject();
      (productObject._id).should.equal('7c401d91-3852-4818-985d-7e7b79f771c3');
      cb(err);
    });
  });

  describe('query population', function() {
    before(function(cb) {
      var photo = new Photo({
        _id: '7c401d91-3852-4818-985d-7e7b79f771c2',
        filename: 'photo.jpg',
        product: '7c401d91-3852-4818-985d-7e7b79f771c3'
      });
      photo.save(cb);
    })

    after(function(cb) {
      Photo.remove({}, cb);
    });

    it('should work', function(cb) {
      Photo.findById('7c401d91-3852-4818-985d-7e7b79f771c2').populate('product').exec(function(err, photo) {
        (photo.product).should.exist;
        (photo.product._id).should.equal('7c401d91-3852-4818-985d-7e7b79f771c3');
        (photo.product.name).should.equal('Some product');
        cb(err);
      })
    })
  })
});
