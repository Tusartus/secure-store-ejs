var express = require('express');
var router = express.Router();

var async = require('async');
var Category = require('../models/category');
var Product = require('../models/product');

/*
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

*/

/*

// instant search api/search    on product pagination page
router.post('/search', function(req, res, next) {
console.log(req.body.search_term);
  Product.search({
    query_string: { query: req.body.search_term }
  }, function(err, results) {
    if (err) return next(err);
    res.json(results);
  });
});

*/


router.get('/:name', function(req, res, next) {
    async.waterfall([
      function(callback) {
        Category.findOne({ name: req.params.name }, function(err, category) {
          if (err) return next(err);
          callback(null, category);
        });
      },

      function(category, callback) {
        for (var i = 0; i < 30; i++) {
         var product = new Product();
          product.category = category._id;
          product.prodname = req.body.pname;
          product.price = req.body.price;
        //  product.image = req.file.filename;

          product.save();


       }
      }
    ]);
    res.json({ message: 'Success' });
});

/*
router.post("/add-product",upload, function(req, res, next){

 var task=new Product({

 prodname:req.body.pname,
 price:req.body.price,
 image:req.file.filename

});
 task.save(function(err,res1){
   //req.flash('success', 'Successfully added a new product ');
   if(err) throw err;
   prodlist.exec(function(err,data){
     if(err) throw err;

       res.render('admin/add-product', { title: 'product lists', products:data });
   });

 });
});

*/





module.exports = router;
