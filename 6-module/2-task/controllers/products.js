const mongoose = require('mongoose');
const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;
  if (mongoose.Types.ObjectId.isValid(subcategory)) {
    const products = await Product.find({subcategory: subcategory});
    ctx.body = {products: products.map((el) => el.toObject())};
  } else {
    ctx.body = {products: []};
    ctx.status = 400;
  }
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();
  ctx.body = {products: products.map((el) => el.toObject())};
};

module.exports.productById = async function productById(ctx, next) {
  const {id} = ctx.params;
  if (mongoose.Types.ObjectId.isValid(id)) {
    const product = await Product.findById(id);
    if (product) {
      ctx.body = {product: product.toObject()};
    } else {
      ctx.body = 'NotFound';
      ctx.status = 404;
    }
  } else {
    ctx.body = 'WrongId';
    ctx.status = 400;
  }
};
