var mongoose = require('mongoose');

var CypressTestSchema = new mongoose.Schema({
  reporterStats: Object,
  error: String,
  screenshots: [Object],
  requester: String,
  creation_date: {type: Date, default: Date.now},
  status: {type: String, default: 'in-progress'}
});

module.exports = mongoose.model('CypressTest', CypressTestSchema);