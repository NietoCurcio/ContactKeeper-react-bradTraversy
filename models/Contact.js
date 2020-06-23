const mongoose = require('mongoose');

const ContactSchema = mongoose.Schema({
  // create a relationship between Contacts and Users
  user: {
    type: mongoose.Schema.Types.ObjectId, // the document have a ObjectId in mongodb, this is type
    ref: 'user', // now refer
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  type: {
    type: String,
    default: 'personal',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('contact', ContactSchema);
