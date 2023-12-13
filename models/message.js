const mongoose = require('mongoose');

// Create a model class for user messages
const MessageSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  contactNumber: String,
  emailAddress: String,
  message: String,
}, {
  collection: 'Messages'
});

module.exports = mongoose.model('Message', MessageSchema);
