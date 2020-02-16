var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

// serialize and deserialize
passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

 // login
 passport.use('local-login', new LocalStrategy({

  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback : true // allows us to pass back the entire request to the callback
},function (req, email, password, done) {
  User.findOne({'email': email}, function (err, user) {
    if (err) {
      return done(err);
    }
    var messages = [];

    if(!user || !user.validPassword(password)) {
      messages.push('Email Does not Exist or Password is Invalid');
      return done(null, false, req.flash('error',  messages));
    }
return done(null, user);
  });
}));


//custom function to validate
exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

