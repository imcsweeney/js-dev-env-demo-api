const mongoose = require('mongoose');

const { Schema } = mongoose;

const blogPost = new Schema({
  userId: { type: String },
  comment: { type: String }
});

module.exports = mongoose.model('BlogPost', blogPost);
