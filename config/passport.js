var passport = require ('passport');

var LocalStrategy = require('passport-local').Strategy;

//var FacebookStrategy = require('passport-facebook').Strategy;
//var secret = require('../secret/secret');

//var User = require('../models/user');

module.exports = function (passport) {

  // passport needs ability to serialize and unserialize users out of session
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // used to deserialize user
  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  // Signup
  passport.use('local.signup', new LocalStrategy({

    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  }, 

  function (req, email, password, done) {
    User.findOne({'email': email}, function (err, user) {
      if (err) {
        return done(err);
      }
      //email already exist 
      if (user) {
        return done(null, false,  req.flash('error', "User with Email already Exist."));
      } else {
       

        var newUser = new User();
        newUser.admincodeid= req.body.admincodeid;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);


        newUser.save(function (err) {
        if(err) throw err;
          return done(null, newUser);
          
        });
      }

    });






  }));

  // login
  passport.use('local.login', new LocalStrategy({

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



/*
  	passport.use(new FacebookStrategy(secret.facebook, (req, token, refleshToken, profile, done) => {
  User.findOne({facebook:profile.id}, (err,user) => {
    if(err){
      return done(err)
    }
    if(user){
      return done(null, user);
    }else{
      var newUser =new User();
      newUser.facebook = profile.id;
      newUser.fullname = profile.displayName;
      newUser.email = profile._json.email;
      newUser.tokens.push({token:  token});

  newUser.save((err) => {
    return done(null, newUser);
  })
    }
  })

}))
*/
















};