var db = require('../config');
var crypto = require('crypto');

var Link = db.mongoose.model('Link', db.linkSchema);

module.exports = Link;
