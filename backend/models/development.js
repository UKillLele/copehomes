const mongoose = require('mongoose');

const developmentSchema = mongoose.Schema({
  name: {type: String, required: true},
  logoPath: {type: String, required: true},
  location: {type: String, required: true},
  build: {type: String, required: true},
  startingPrice: {type: Number, required: true},
  lots: {type: Number, required: true}
});

module.exports = mongoose.model('Development', developmentSchema);
