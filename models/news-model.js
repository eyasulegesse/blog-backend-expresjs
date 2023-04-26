const mongoose = require('mongoose');
const NewsSchema = new mongoose.Schema({
  title: { required: true, type: String },
  summary: { required: true, type: String },
  body: { required: true, type: String },
  photo: { required: true, type: String },
  category: { required: true, type: String },
});

module.exports = mongoose.model('News', NewsSchema);
