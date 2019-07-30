const mongoose = require('mongoose');
const connection = require('../libs/connection');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: mongoose.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  subcategory: {
    type: mongoose.Types.ObjectId,
    required: true,
  },

  images: [String],
});

productSchema.set('toObject', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

productSchema.index(
    {
      title: 'text',
      description: 'text',
    },
    {
      weights: {
        title: 10,
        description: 5,
      },
      name: 'TextSearchIndex',
      default_language: 'russian',
    }
);

module.exports = connection.model('Product', productSchema);
