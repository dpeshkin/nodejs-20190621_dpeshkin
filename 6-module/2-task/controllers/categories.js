const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find();
  const categoriesToObject = categories.map((cat) => {
    const category = cat.toObject();
    category.subcategories = cat.subcategories.map((subCat) => subCat.toObject());
    return category;
  });
  ctx.body = {categories: categoriesToObject};
};
