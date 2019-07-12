const mongoose = require('mongoose');

const detailSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true},
  logoPath: {type: String, required: true},
  location: {type: String, required: true},
  build: {type: String, required: true},
  startingPrice: {type: Number, required: true},
  lots: {type: Number, required: true},
  description: {type: String, required: true},
  platPath: {type: String, required: true},
  svgPath: {type: String, required: true},
  svgStyle: {type: String, required: true},
  map: {type: String, required: true}
});

module.exports = mongoose.model('Detail', detailSchema);
