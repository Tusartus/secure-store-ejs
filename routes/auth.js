var router = require('express').Router();
var User = require('../models/user');
var Cart = require('../models/cart');
var async = require('async');
var passport = require('passport');
var passportConf = require('../config/passport-new');


router.get('/login', function(req, res) {
    var errors = req.flash('error');
  //if (req.user) return res.redirect('/');
  res.render('accounts/login', { title:'login page', messages: errors, hasErrors: errors.length > 0});
});

router.post('/login', loginValidation, passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

//code ok   : user /profile without product 
/*
router.get('/profile',  passportConf.isAuthenticated, function(req, res, next) {
  User.findOne({ _id: req.user._id }, function(err, user) {
    if (err) return next(err);

    res.render('accounts/profile', {title: 'profile page', user: user });

  });

});
*/

//user with product on /profile 
router.get('/profile', passportConf.isAuthenticated, function(req, res, next) {
  User
    .findOne({ _id: req.user._id })
    .populate('history.item')
    .exec(function(err, foundUser) {
      if (err) return next(err);

      res.render('accounts/profile', { title:'profile page' , user: foundUser });
    });
});


router.get('/signup', function(req, res, next) {
    var errors = req.flash('error');

  res.render('accounts/signup', { title:'register page', messages: errors, hasErrors: errors.length > 0,
    errors: req.flash('errors')
  });
});


router.post('/signup', validate, function(req, res, next) {

  async.waterfall([      //for cart with user 
    function(callback) {  
      User.findOne({ email: req.body.email }, function(err, existingUser) {

        if (existingUser) {
          req.flash('errors', 'Account with that email address already exists');
          return res.redirect('/signup');
        } else {
         
          var newUser = new User();
            newUser.name = req.body.name;
            newUser.username = req.body.username;
            newUser.email = req.body.email;
            newUser.password = newUser.encryptPassword(req.body.password);
    
            newUser.save(function(err, user) {
              if (err) return next(err);
              callback(null, user); //for cart and user in sign up with cart 
            });
       }
     });
    },


    function(user) {     //cart with user 
      var cart = new Cart();
      cart.owner = user._id;
      cart.save(function(err) {
        if (err) return next(err);
        req.logIn(user, function(err) {
          if (err) return next(err);
          res.redirect('/login');
        });
      });
      
    }



    
  ]);
});

/*
CODE OK
//begin sign up without cart 

router.post('/signup', validate, function(req, res, next) {
 
  User.findOne({ email: req.body.email }, function(err, existingUser) {

    if (existingUser) {
      req.flash('errors', 'Account with that email address already exists');
      return res.redirect('/signup');
    } else {
     
      var newUser = new User();
        newUser.name = req.body.name;
        newUser.username = req.body.username;
        newUser.email = req.body.email;
        newUser.password = newUser.encryptPassword(req.body.password);

        newUser.save(function(err, user) {
          if (err) return next(err);
  
          req.logIn(user, function(err) {
            if (err) return next(err);
            res.redirect('/login');
  
          })
        });

     
    }
  });
});

//end signup post without  cart 

*/

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});



/*
router.get('/edit-profile', function(req, res, next) {
  res.render('accounts/edit-profile', { message: req.flash('success') , title:"profile page"});
});

router.post('/edit-profile', function(req, res, next) {
  User.findOne({ _id: req.user._id }, function(err, user) {

    if (err) return next(err);

    if (req.body.name) user.profile.name = req.body.name;
    if (req.body.address) user.address = req.body.address;

    user.save(function(err) {
      if (err) return next(err);
      req.flash('success', 'Successfully Edited your profile');
      return res.redirect('/edit-profile');
    });
  });
});
*/




//function with v express validator on signup 
function validate(req,res, next){
    req.checkBody('name', 'Name is Required').notEmpty();
    req.checkBody('name', 'Name Must not be less than 4').isLength({min:4});
    req.checkBody('email', 'Email field is require').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password', 'Password must not be less than 5').isLength({min:5});
    req.checkBody("password", "Password must contain at least 1 Number.").matches(/^(?=.*\d)(?=.*[a-z])[0-9a-z]{5,}$/, "i");
    req.checkBody('password2', 'Password do not match').equals(req.body.password);
  
    
    var errors =req.validationErrors();
    if(errors){
      var messages = [];
    errors.forEach(function(error){
        messages.push(error.msg);
      });
    
      req.flash('error', messages);
      res.redirect('/signup');
    
    }else{
       return next();
    }
    
    }


    function loginValidation (req,res, next){
        req.checkBody('email', 'Email is Required').notEmpty();
        req.checkBody('email', 'Email is Invalid').isEmail();
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('password', 'Password must not be less than 5').isLength({min:5});
        req.checkBody("password", "Password must contain at least 1 Number.").matches(/^(?=.*\d)(?=.*[a-z])[0-9a-z]{5,}$/, "i");
        
        var loginErrors =req.validationErrors();
        if(loginErrors){
          var messages = [];
          loginErrors.forEach(function(error){
            messages.push(error.msg);
          });
          req.flash('error', messages);
          res.redirect('/login');
        
        }else{
           return next();
        }
        
        
        }







module.exports = router;
