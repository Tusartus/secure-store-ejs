var PORT = process.env.PORT || 4000;

var express  = require("express");
var bodyParser  = require("body-parser");
var ejs  = require("ejs");
var engine = require("ejs-mate");
var flash = require('express-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);
var multer  = require('multer');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');

//var upload = multer({dest: './uploads'});
var flash = require('connect-flash');
var bcrypt = require('bcryptjs');

const helmet = require('helmet')
var compression = require('compression')

var Category = require('./models/category');
var Product = require('./models/product');


//var apiRoutes = require('./api/api');
var mainRoutes = require('./routes/main');
var adminRoutes = require('./routes/admin');
var authRoutes = require('./routes/auth');

//cart lenght on quantity
var cartLength = require('./middlewares/middlewares');

// config passport
//require('./config/passport')(passport);
//for admin login with passport


var app = express();

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect( process.env.MONGODB_URI || "mongodb://avocette01:avocette01@ds247001.mlab.com:47001/heroku_lxztz98k", {useNewUrlParser: true});
mongoose.connection.once('open',function(){
  console.log('connection has made');
}).on('error',function(error){
  console.log('connection error:',error);
});



// Middleware
app.use(express.static(__dirname + '/public'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'secretmyonesecretKey',
  store: new MongoStore({ mongooseConnection: mongoose.connection, autoReconnect: true})
    // store: new MongoStore({ url: secret.database, autoReconnect: true   /*ttl: 2 * 24 * 60 * 60*/})
}));
app.use(flash());
app.use(helmet());
app.use(compression());



//passport middleware
app.use(passport.initialize());
app.use(passport.session());


//Express Validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.'),
    root = namespace.shift(),
    formParam = root;

  while(namespace.length){
    formParam += '[' + namespace.shift() + ']';
  }
  return {
    param : formParam,
    msg : msg,
    value : value
  };
  }
}));

//flash middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

app.use(cartLength);
app.use(function(req, res, next) {
  Category.find({}, function(err, categories) {
    if (err) return next(err);
    res.locals.categories = categories;
    next();
  });
});






app.use(mainRoutes);
app.use( adminRoutes);
app.use(authRoutes);

//routes index
//require('./routes/user')(app,passport);





app.listen(PORT, function() {
  console.log("Server is Running on port ", + PORT);
});
