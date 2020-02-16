var passport = require('passport');
var User = require('../models/user');


module.exports = function(app,passport){



  app.get('/signup', function (req, res) {
    var errors = req.flash('error');
    		res.render('main/register', {title: 'Sign up || Joinlog', messages: errors, hasErrors: errors.length > 0 });
    	});

  app.post('/signup', validate, passport.authenticate('local.signup', {
  		successRedirect: '/login',
  		failureRedirect: '/signup',
  		failureFlash: true // allow flash messages
  	}));

    app.get('/login', function (req, res){
      var errors = req.flash('error');
  		res.render('main/login',{title: 'login || Joinlog', messages: errors, hasErrors: errors.length > 0 });
  	});
    app.post('/login', loginValidation, passport.authenticate('local.login', {
    		successRedirect: '/dashboard',
    		failureRedirect: '/login',
    		failureFlash: true // allow flash messages
      }));

      app.get('/dashboard', function(req,res){
        res.render('main/dashboard', {title: 'Dashboard page', user: req.user});

      });
      
      
//Logout
app.get('/logout', (req,res) =>{
	req.logout();

	req.session.destroy((err) =>{
		res.redirect('/');
	 })
});




    };



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



       //function with v express validator on login 

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




/*
router.post('/register',  function (req, res, next) {
    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;


    // Form Validator
    req.checkBody('name', 'Name field is require').notEmpty();
    req.checkBody('email', 'Email field is require').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password2', 'Password do not match').equals(req.body.password);

    //check Errors

    //error handing for signing + registering
    var errors = req.validationErrors();

    if(errors){
    var messages = [];
  errors.forEach(function(error){
      messages.push(error.msg);
    });

    req.flash('error', messages);
    res.redirect('register');

*/













