const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const query = ctx.query.query;
  const products = await Product.find({$text: {$search: query}});
  ctx.body = {products: products.map((el) => el.toObject())};
};
