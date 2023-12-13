const mongoose = require('mongoose');

// Define the schema for the cart items
const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Product document
    ref: 'Product'
  },
  quantity: {
    type: Number,
    default: 1 // Default quantity when a product is added
  }
}, {
  timestamps: true // to record when items were added
});


// Define the schema for the orders
const OrderSchema = new mongoose.Schema({
  products: [CartItemSchema],
  subtotal: Number,
  tax: Number,
  total: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

// Create a model class with the cart field
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  cart: [CartItemSchema], // Array of cart items
  orders: [OrderSchema]
}, {
  collection: 'Users'
});

module.exports = mongoose.model('User', UserSchema);
