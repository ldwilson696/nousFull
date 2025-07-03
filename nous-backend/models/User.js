const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio:      { type: String, default: '' },
  avatar:   { type: String, default: '' },
  profileImage: { type: String },
  location: { type: String, default: '' },
  occupation: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);