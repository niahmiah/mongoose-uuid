# Mongoose UUID Data type
========================

[![NPM Package](https://img.shields.io/npm/v/mongoose-uuid2.svg?style=flat-square)](https://www.npmjs.org/package/mongoose-uuid2)
[![Build Status](https://img.shields.io/travis/niahmiah/mongoose-uuid.svg?branch=master&style=flat-square)](https://travis-ci.org/niahmiah/mongoose-uuid)
[![Coverage Status](https://img.shields.io/coveralls/niahmiah/mongoose-uuid.svg?branch=master&style=flat-square)](https://coveralls.io/github/niahmiah/mongoose-uuid)

## Why
MongoDB supports storing UUID v1 and v4 in Binary format. Why not take advantage of that when using UUIDs?

## What does it do?
This will add an additional UUID type to mongoose. When used instead of String, UUIDs will be stored in Binary format, which takes about half as much space.

This also makes it easy for you to continue to work with UUIDs as strings in your application. It automatically casts Strings to Binary, and when read a document from the database, and you access a property directly, you get the value back as a String.

**New: Query population now works correctly!**

## How to use

```JavaScript
var uuid = require('node-uuid');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Will add the UUID type to the Mongoose Schema types
require('mongoose-uuid2')(mongoose);
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

```
## Example
```JavaScript
> var product = new Product({ _id: '7c401d91-3852-4818-985d-7e7b79f771c3' });
> console.log(product);
{ _id:
   { _bsontype: 'Binary',
     sub_type: 4,
     position: 16,
     buffer: <Buffer 7c 40 1d 91 38 52 48 18 98 5d 7e 7b 79 f7 71 c3> } }

  console.log(product.toObject());
  { _id: "7c401d91-3852-4818-985d-7e7b79f771c3" }

> product._id = '48c53f87-21f6-4dee-92f2-f241f942285d';
> console.log(product);
{ _id:
   { _bsontype: 'Binary',
     sub_type: 4,
     position: 16,
     buffer: <Buffer 48 c5 3f 87 21 f6 4d ee 92 f2 f2 41 f9 42 28 5d> } }

> console.log(product._id);
48c53f87-21f6-4dee-92f2-f241f942285d
```
