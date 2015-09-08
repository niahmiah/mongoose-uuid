## How to use

```JavaScript
var uuid = require('node-uuid');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Will add the UUID type to the Mongoose Schema types
require('mongoose-uuid').loadType(mongoose);
var UUID = mongoose.Types.UUID;

// If you don't have the UUID variable declared you can use 'mongoose.Types.UUID'
var ProductSchema = Schema({
  someID: { type: UUID }
});

var Product = mongoose.model('Product', ProductSchema);

var product = new Product({ someID: "7c401d91-3852-4818-985d-7e7b79f771c3" });
product.someID; // Array: [ 124, 64, 29, 145, 56, 82, 72, 24, 152, 93, 126, 123, 121, 247, 113, 195 ]
product.someID = '48c53f87-21f6-4dee-92f2-f241f942285d';
product.someID; // Array: [ 72, 197, 63, 135, 33, 246, 77, 238, 146, 242, 242, 65, 249, 66, 40, 93 ]
uuid.unparse(product.someID); // '48c53f87-21f6-4dee-92f2-f241f942285d';
```