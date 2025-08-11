// backend/models/UserProfile.js
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  link: String
});

const UserProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  name: String,
  email: String,
  skills: [String],
  projects: [ProjectSchema],
  github: String,
});

module.exports = mongoose.model('UserProfile', UserProfileSchema);
