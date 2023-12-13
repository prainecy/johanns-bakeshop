const mongoose = require('mongoose');

// Define the product schema
const ProductSchema = new mongoose.Schema({
  Name: String,
  Type: String,
  Cost: Number,
  Relevance: Number,
}, {
  collection: 'Products'
});

module.exports = mongoose.model('Product', ProductSchema);
