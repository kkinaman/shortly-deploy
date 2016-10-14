var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var User = db.mongoose.model('User', db.userSchema);

module.exports = User;
