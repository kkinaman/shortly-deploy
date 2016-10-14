var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({}, function(err, links) {
    res.status(200).send(links);
  });

};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }
  Link.findOne({ url: uri }, function(err, link) {
    if (err) {
      console.log(err);
    }
    if (link) {
      res.end(JSON.stringify(link));
    }
    if (!link) { 
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        link = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        });
        link.code = link.generateCode(uri);
        link.save(function(err) {
          if (err) {
            console.log(err);
            return;
          }
          res.status(200).send(link);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ 'username': username }, function (err, user) {
    if (err) {
      console.log(err);
    }
    if (!user) {
      res.redirect('/login');
    } else {
      user.comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    }
  });

};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  
  User.findOne({ 'username': username }, function (err, user) {
    if (err) {
      console.log(err);
    }
    if (!user) {

      var newUser = new User({
        username: username,
        password: password
      });
      newUser.hashPassword();
      newUser.save(function(err) {
        if (err) {
          console.log(err);
        }
        util.createSession(req, res, newUser);
      });

    } else {
      user.comparePassword(password, function(match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/signup');
        }
      });
    }
  });
};

exports.navToLink = function(req, res) {
  Link.findOne({ 'code': req.params[0] }, function (err, link) {
    if (!link) {
      res.redirect('/');
    } else {
      link.visits++;
      link.save(function(err) {
        if (err) {
          console.log(err);
        }
        res.redirect(link.url);
      });
    }
  });
};