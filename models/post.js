const mongoose = require('mongoose');

const Post = new mongoose.model('Post', {
  img: String,
  twit: String,
  likes: { type: Number, default: 0 },
  userId: { type: mongoose.ObjectId, ref: 'User' },
  createdAt: Date,
});

module.exports = Post
