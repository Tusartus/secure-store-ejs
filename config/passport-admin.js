var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Admin = require('../models/admin');

// serialize and deserialize
passport.serializeUser(function(admin, done) {
  done(null, admin._id);
});

passport.deserializeUser(function(id, done) {
  Admin.findById(id, function(err, admin) {
    done(err, admin);
  });
});

 // login
 passport.use('local-admin-login', new LocalStrategy({

  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback : true // allows us to pass back the entire request to the callback
},function (req, email, password, done) {
  Admin.findOne({'email': email}, function (err, admin) {
    if (err) {
      return done(err);
    }
    var messages = [];

    if(!admin || !admin.validPassword(password)) {
      messages.push('Email Does not Exist or Password is Invalid');
      return done(null, false, req.flash('error',  messages));
    }
return done(null, admin);
  });
}));


//custom function to validate
exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/admin-login');
}

