# Mongoose UUID Data type
========================
[![NPM Package](https://img.shields.io/npm/v/mongoose-uuid2.svg?style=flat-square)](https://www.npmjs.org/package/mongoose-uuid2)
[![Build Status](https://img.shields.io/travis/niahmiah/mongoose-uuid.svg?branch=master&style=flat-square)](https://travis-ci.org/niahmiah/mongoose-uuid)
[![Coverage Status](https://img.shields.io/coveralls/niahmiah/mongoose-uuid.svg?branch=master&style=flat-square)](https://coveralls.io/github/niahmiah/mongoose-uuid)

## Why
MongoDB supports storing UUID v1 and v4 in Binary format. Why not take advantage of that when using UUIDs?

## What does it do?
This will add an additional UUID type to mongoose. When used instead of String, UUIDs will be stored in Binary format, which takes about half as much space.

This also makes it easy for you to continue to work with UUIDs as strings in your application. It automatically casts Strings to Binary, and when read a document from the database, and you access a property directly, (or use .toObject()), you get the value back as a String.

## How to use

```JavaScript
var uuid = require('node-uuid');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Will add the UUID type to the Mongoose Schema types
require('mongoose-uuid2').loadType(mongoose);
var UUID = mongoose.Types.UUID;

// If you don't have the UUID variable declared you can use 'mongoose.Types.UUID'
var ProductSchema = Schema({
  someID: { type: UUID }
});

var Product = mongoose.model('Product', ProductSchema);

var product = new Product({ someID: '7c401d91-3852-4818-985d-7e7b79f771c3' });
product.someID; // Array: [ 124, 64, 29, 145, 56, 82, 72, 24, 152, 93, 126, 123, 121, 247, 113, 195 ]
product.someID = '48c53f87-21f6-4dee-92f2-f241f942285d';
product.someID; // Array: [ 72, 197, 63, 135, 33, 246, 77, 238, 146, 242, 242, 65, 249, 66, 40, 93 ]
uuid.unparse(product.someID); // '48c53f87-21f6-4dee-92f2-f241f942285d';
```
