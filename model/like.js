const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  stock: { type: String, required: true },
  hashedIp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }  
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;