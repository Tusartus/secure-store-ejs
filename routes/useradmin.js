var passport = require('passport');
var User = require('../models/useradmin');


module.exports = function(app,passport){



  app.get('/signup', function (req, res) {
    var errors = req.flash('error');
    		res.render('admin/admin-signup', {title: 'Sign up || Joinlog', messages: errors, hasErrors: errors.length > 0 });
    	});

  app.post('/signup', validatead, passport.authenticate('local.signup', {
  		successRedirect: '/login',
  		failureRedirect: '/signup',
  		failureFlash: true // allow flash messages
  	}));

    app.get('/login', function (req, res){
      var errors = req.flash('error');
  		res.render('admin/admin-login',{title: 'login || Joinlog', messages: errors, hasErrors: errors.length > 0 });
  	});
    app.post('/login', loginValidationad, passport.authenticate('local.login', {
    		successRedirect: '/admin-home',
    		failureRedirect: '/login',
    		failureFlash: true // allow flash messages
      }));

      app.get('/admin-home', isLoggedIn, function(req,res){
        res.render('admin/admin-home', {title: 'Dashboard page', user: req.user });

      });
      
      app.get('/admin-index', function(req,res){
        res.render('admin/admin-index', {title: 'index page'});

      });


//Logout
app.get('/admin-logout', (req,res) =>{
	req.logout();

	req.session.destroy((err) =>{
		res.redirect('/admin-index');
	 })
});



    };



    //function with v express validator on signup 
    function validatead(req,res, next){
      req.checkBody('admincodeid', 'Admin ID is Required').notEmpty();
      req.checkBody('admincodeid', 'Adin ID  Must not be less than 4').isLength({min:4});
      req.checkBody('email', 'Email field is require').notEmpty();
      req.checkBody('email', 'Email is not valid').isEmail();
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

      function loginValidationad (req,res, next){
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

        function isLoggedIn(req,res, next){
            if(req.isAuthenticated()){
             next()
         }else{
             res.redirect('/admin-index')
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








