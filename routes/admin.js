var express = require('express');
var router = express.Router();
var path= require('path');
var Category = require('../models/category');
var Product = require('../models/product');
var Admin = require('../models/admin');

var prodlist=Product.find({});

var passport = require('passport');
//var passportConf = require('../config/passport-admin');




const ITEMS_PER_PAGE = 2;

var multer = require('multer');

router.use(express.static(__dirname+"./public/"));

if(typeof localStorage==="undefined" || localStorage===null){
  const LocalStorage = require('node-localstorage').LocalStorage;
  localStorage=new LocalStorage('./scratch');
}


var Storage = multer.diskStorage({
  destination:"./public/uploads/",
  filename: function(req, file, cb) {
    cb(null,file.fieldname+"_"+Date.now() + path.extname(file.originalname));
  }
});

var upload= multer({
  storage:Storage
}).single('file');








router.get('/add-category',  isAdminAuth, function(req, res, next) {
  res.render('admin/add-category', { title:'add product', message: req.flash('success') });
});


router.post('/add-category', isAdminAuth,  function(req, res, next) {
  var category = new Category();
  category.name = req.body.name;

  category.save(function(err) {
    if (err) return next(err);
    req.flash('success', 'Successfully added a category');
    return res.redirect('/add-category');
  });
})

router.get('/add-product', isAdminAuth,  function(req,res,next) {
  res.render('admin/add-product', { title:'add product', message: req.flash('success') });

});



router.post("/add-product",upload, isAdminAuth,  function(req, res, next){

 var task=new Product({
 category: req.body.cat,
 prodname:req.body.pname,
 price:req.body.price,
 image:req.file.filename

});
 task.save(function(err,res1){
   //req.flash('success', 'Successfully added a new product ');
   if(err) throw err;
   Product
   .find({category:req.params.id})
   .populate('category')
   .exec(function(err,data){
     if(err) throw err;
       req.flash('success', 'Successfully added a new product ');
       res.render('admin/add-product', { title: 'product lists', products:data });
   });

 });



});


 router.get("/all-products", isAdminAuth,  (req, res, next) => {


     Product
      .find()
      .populate('category')
      .exec()
      .then(products => {
      console.log(products);

      res.render('admin/all-products', {
        prods: products,
        title: 'Admin Products'


      });
    })
    .catch(err => console.log(err));

});

//product with pagination

router.get('/admin-products',  isAdminAuth, function(req, res, next) {

const page = +req.query.page || 1;
let totalItems;

Product.find()
  .countDocuments()
  .then(numProducts => {
    totalItems = numProducts;
    return Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
  })
  .then(products => {
    res.render('admin/products', {
      products: products,
      title: 'Products',

      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
    });
  })
  .catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  });

});




router.get('/admin-index',  function(req,res){
  res.render('admin/admin-index', {title: 'Dashboard page' });

});

//post admin signup
router.post('/admin-signup', function(req, res, next) {

  Admin.findOne({ email: req.body.email }, function(err, existingAdmin) {

    if (existingAdmin) {
      req.flash('errors', 'Account with that email address already exists');
      return res.redirect('/admin-signup');
    } else {

      var newAdmin = new Admin();
        newAdmin.admincode = req.body.admincode;
        newAdmin.email = req.body.email;
        newAdmin.password = newAdmin.encryptPassword(req.body.password);

        newAdmin.save(function(err, admin) {
          if (err) return next(err);

          req.logIn(admin, function(err) {
            if (err) return next(err);
            res.redirect('/admin-login');

          })
        });


    }
  });
});






  //controller on add-product

  function isAdminAuth( req, res, next) {
    if(req.isAuthenticated () && req.user.isAdmin) {
       next();
       return;
    }
    res.redirect('/');

  }


module.exports = router;
