/*

-----------------------
 /*

    if(req.file){
        console.log('Uploading File...');
        var profileimage = req.file.filename;
    } else {
        console.log('No File Uploaded...');
        var profileimage = 'noimage.jpg';
    }
    */

    // Form Validator
      /*
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


    }










---------------


if(typeof localStorage==="undefined" || localStorage===null){
  const LocalStorage = require('node-localstorage').LocalStorage;
  localStorage=new LocalStorage('./scratch');
}


var Storage = multer.diskStorage({
  destination:"./public/images/",
  filename: function(req, file, cb) {
    cb(null,file.fieldname+"_"+Date.now() + path.extname(file.originalname));
  }
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

var upload= multer({
  storage:Storage,
  fileFilter:fileFilter
}).single('profileimage')


var User = require('../models/user');




/* LOGIN AND Register */
/*
router.get('/register', function(req, res,next) {
   var errors = req.flash('error');
   res.render('main/register',{title: 'Sign up || Joinlog', messages: errors, hasErrors: errors.length > 0,
   errors: req.flash('errors')
  });

});

router.get('/login', function(req, res,next) {
  res.render('main/login',{
    message: req.flash('success')
  });
});
*/
/*
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


//locat strategy to control correct usernames + passwords

passport.use(new LocalStrategy({
    usernameField: 'email',
     passwordField: 'password',
     passReqToCallback : true // allows us to pass back the entire request to the callback
   },function (req, email, password, done) {
     User.findOne({'email': email}, function (err, user) {
       if (err) {
         return done(err);
       }

/*
  function(username, password, done){
      User.getUserByUsername(username, function(err, user){
        if(err) throw err;

        var messages = [];

      if(user) {
        messages.push('That email already taken');
        return done(null, false, req.flash('error',  messages));
      }
        /*
        if(!user){
            return done(null, false, {message: 'Unknown User'});
        }


        User.comparePassword(password, user.password, function(err, isMatch){
            if(err) return done(err);
            if(isMatch){
                return done(null, user);
            } else {
                return done(null, false, {message: 'Invalid Password'});
            }
        });
    });

}));

*/


/*
router.post('/register', upload , function (req, res, next) {
    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;


    if(req.file){
        console.log('Uploading File...');
        var profileimage = req.file.filename;
    } else {
        console.log('No File Uploaded...');
        var profileimage = 'noimage.jpg';
    }

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


    } else {
        var newUser = new User({
           name: name,
           email: email,
           username: username,
           password: password,
           profileimage: profileimage
        });

        User.createUser(newUser, function(err, user){
            if(err) throw err;
            console.log(user);
        });

        req.flash('success', 'You are now registered and can signin');
        res.location('/');
        res.redirect('login');
    }
});


*/


/*

if(req.file){
    console.log('Uploading File...');
    var profileimage = req.file.filename;
} else {
    console.log('No File Uploaded...');
    var profileimage = 'noimage.jpg';
}
*/

// Form Validator
/*
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

/*

//post payment with stripe
router.post('/payment', function(req, res, next) {

  var stripeToken = req.body.stripeToken;
  var currentCharges = Math.round(req.body.stripeMoney * 100);
  stripe.customers.create({
    source: stripeToken,
  }).then(function(customer) {
    return stripe.charges.create({
      amount: currentCharges,
      currency: 'usd',
      customer: customer.id
    });
  }).then(function(charge) {
    async.waterfall([
      function(callback) {
        Cart.findOne({ owner: req.user._id }, function(err, cart) {
          callback(err, cart);
        });
      },
      function(cart, callback) {
        User.findOne({ _id: req.user._id }, function(err, user) {
          if (user) {
            for (var i = 0; i < cart.items.length; i++) {
              user.history.push({
                item: cart.items[i].item,
                paid: cart.items[i].price
              });
            }

            user.save(function(err, user) {
              if (err) return next(err);
              callback(err, user);
            });
          }
        });
      },
      function(user) {
        Cart.update({ owner: user._id }, { $set: { items: [], total: 0 }}, function(err, updated) {
          if (updated) {
            res.redirect('/profile');
          }
        });
      }
    ]);

  });

});

*/