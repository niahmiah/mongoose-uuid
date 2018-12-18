var uuidv4 = require('uuid/v4');
var mongoose = require('mongoose');
var bson = require('bson');
var should = require('chai').should();
var Schema = mongoose.Schema;

// adds the UUID type to the Mongoose Schema types
require('../index')(mongoose);
var UUID = mongoose.Types.UUID;

var ProductSchema = Schema({
  _id: { type: UUID, default: uuidv4 },
  name: String
}, { id: false });

ProductSchema.set('toObject', {getters: true});
ProductSchema.set('toJSON', {getters: true});

var Product = mongoose.model('Product', ProductSchema);

describe('mongoose-uuid', function() {
  before(function() {
    return mongoose.connect('mongodb://localhost:27017/mongoose-uuid-test', { useNewUrlParser: true })
  })

  after(function(cb) {
    Product.deleteMany({}, function() {
      mongoose.disconnect(cb);
    });
  });

  it('should cast uuid strings to binary', function() {
    var product = new Product({
      _id: '7c401d91-3852-4818-985d-7e7b79f771c3',
      name: 'Some product'
    });

    (product._doc._id instanceof mongoose.Types.Buffer.Binary).should.equal(true);
  });

  it('should cast null to null', function() {
    var product = new Product({
      _id: null,
      name: 'Some product'
    });

    (product._doc._id == null).should.equal(true);
  });

  it('should not throw when given anything other than a Buffer or String', function() {
    var product = new Product({
      _id: 300,
      name: 'Some product'
    });

    (product._doc._id == null).should.equal(false);
  });

  it('should convert back to text with toObject()', function() {
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
    var PetSchema = Schema({
      _id: { type: UUID, default: uuidv4 },
      name: String,
    }, { id: false });

    PetSchema.set('toObject', {getters: true});
    PetSchema.set('toJSON', {getters: true});

    var Pet = mongoose.model('Pet', PetSchema);

    var PhotoSchema = Schema({
      _id: { type: UUID, default: uuidv4 },
      filename: String,
      pet: { type: UUID, ref: 'Pet', required: true }
    }, { id: false });

    PhotoSchema.set('toObject', {getters: true});
    PhotoSchema.set('toJSON', {getters: true});

    var Photo = mongoose.model('Photo', PhotoSchema);

    before(function(cb) {
      var pet = new Pet({
        name: 'Sammy'
      });

      var photo = new Photo({
        _id: '7c401d91-3852-4818-985d-7e7b79f771c2',
        filename: 'photo.jpg',
        pet: pet._id
      });

      pet.save(function() {
        photo.save(cb);
      })
    })

    after(function(cb) {
      Pet.deleteMany(function() {
        Photo.deleteMany({}, cb);
      })
    });

    it('should work', function(cb) {
      Photo.findById('7c401d91-3852-4818-985d-7e7b79f771c2').populate('pet').exec(function(err, photo) {
        (photo.pet).should.exist;
        (photo.pet.name).should.equal('Sammy');

        cb(err);
      });
    });
  });

  describe('other scenarios', function() {
    var BoatSchema = Schema({
      _id: { type: UUID, default: uuidv4 },
      dingy: { type: UUID, ref: 'Boat' },
      name: String,
    }, { id: false });

    BoatSchema.set('toJSON', {getters: true});

    var Boat = mongoose.model('Boat', BoatSchema);

    afterEach(function(cb) {
      Boat.deleteMany({}, cb);
    });

    it('should get with no value', function() {
      var boat = new Boat({
        name: 'Sunshine'
      });

      (undefined === boat.dingy).should.be.true;
    });

    it('setting a populated field to uuid string', function(cb) {
      var ripples = new Boat({
        name: 'Ripples'
      });
      var splash = new Boat({
        name: 'Splash'
      });
      var sunshine = new Boat({
        name: 'Sunshine',
        dingy: ripples._id
      });

      splash.save(function() {
        ripples.save(function() {
          sunshine.save(function() {
            Boat.findOne({name: 'Sunshine'}).populate('dingy').exec(function(err, boat) {
              (boat.dingy._id).should.equal(ripples._id);

              boat.dingy = splash._id;
              boat.save(function() {
                Boat.findOne({name: 'Sunshine'}).populate('dingy').exec(function(err, boat2) {
                  (boat2.dingy._id).should.equal(splash._id);

                  cb();
                })
              })
            })
          })
        })
      })
    });
  });
});
