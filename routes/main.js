var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Category = require('../models/category');
var Product = require('../models/product');
var Cart = require('../models/cart');

var async = require('async');


var stripe = require('stripe')('sk_test_tVTG9vgCu8ReG0XO6LyCKfeL00ZqIHp98M');



const ITEMS_PER_PAGE = 3;

/*
router.get('/', function(req, res,next) {
  res.render('index', {title: 'index pagex '});
});
*/
// index pages
router.get('/', function(req, res, next) {
  Product
    .find()
    //.populate('category')
    .exec(function(err, products) {
      if (err) return next(err);
      res.render('main/index', {
        products: products,
        title: 'products'
      });
    });
});

/*
router.get('/a', function(req, res,next) {
  res.render('main/about');
});
*/
router.get('/category', function(req, res,next) {
  res.render('main/category',{title:' category'});
});

router.get('/card', function(req, res,next) {
  res.render('main/card');
});




//cart route 
router.get('/cart', function(req, res, next) {
  Cart
    .findOne({ owner: req.user._id })
    .populate('items.item')
    .exec(function(err, foundCart) {
      if (err) return next(err);
      res.render('main/cart', {
        foundCart: foundCart,
        title:'foundcart',
        message: req.flash('remove')
      });
    });
});


//adding product to an cart 
//post cart quantity 
router.post('/product/:product_id', function(req, res, next) {
  Cart.findOne({ owner: req.user._id }, function(err, cart) {
    cart.items.push({
      item: req.body.product_id,
      price: parseFloat(req.body.priceValue),
      quantity: parseInt(req.body.quantity)
    });

    cart.total = (cart.total + parseFloat(req.body.priceValue)).toFixed(2);

    cart.save(function(err) {
      if (err) return next(err);
      return res.redirect('/cart');
    });
  });
});
//remove cart 
router.post('/remove', function(req, res, next) {
  Cart.findOne({ owner: req.user._id }, function(err, foundCart) {
    foundCart.items.pull(String(req.body.item));

    foundCart.total = (foundCart.total - parseFloat(req.body.price)).toFixed(2);
    foundCart.save(function(err, found) {
      if (err) return next(err);
      req.flash('remove', 'Successfully removed');
      res.redirect('/cart');
    });
  });
});

//end cart










// product routes  per one categroy
router.get('/products/:id', function(req, res, next) {
  Product
    .find({ category: req.params.id })
    .populate('category')
    .exec(function(err, products) {
      if (err) return next(err);
      res.render('main/category', {
        products: products,
        title: 'products'
      });
    });
});




// single product route
router.get('/product/:id', function(req, res, next) {
  Product.findById({ _id: req.params.id }, function(err, product) {
    if (err) return next(err);
    res.render('main/product', {
      product: product,
      title: 'product'
    });
  });
});




//pagination


router.get('/all', function(req, res, next) {

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
    res.render('main/product-main', {
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

  }).then(function(charge){
     async.waterfall([
     function(callback){
      Cart.findOne({ owner: req.user._id }, function(err, cart) {
        callback(err, cart);
      });
     },
     function(cart, callback){
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
    function(user){
      Cart.update({ owner: user._id }, { $set: { items: [], total: 0 }}, function(err, updated) {
        if (updated) {
          res.redirect('/profile');
        }
      });
    }

     ]);

  });


});

/*








// filter products
/*
router.post("/search/", function(req, res, next){
  var flrtName = req.body.fltrname;
  var flrtEmail = req.body.fltrprice;
  var fltremptype = req.body.fltremptype;

  if(flrtName !='' &&  flrtEmail !='' &&  fltremptype !=''){

    var flterParameter={$and:[{name:flrtName},
      {$and:[{email:flrtEmail},{etype:fltremptype}]}


    ]}
  }else if(flrtName !='' && flrtEmail =='' && fltremptype !=''){
    var flterParameter={$and:[{name:flrtName},{etype:fltremptype}]
    }

  }else if(flrtName =='' && flrtEmail !='' && fltremptype !=''){
      var flterParameter={$and:[{email:flrtEmail},{etype:fltremptype}]
  }

}else{
  var flterParameter={}
}
  var employeeFilter=prodlist.find(flterParameter);
  employeeFilter.exec(function(err,data){
    if(err) throw err;
      res.render('main/about', { title: 'Employee Records', products:data });
  });


});

*/







router.get('/home', function(req, res,next) {
  res.render('admin/home', {title:'home'});
});

//if cart is o on quantit 
router.get('/emptycart', function(req, res,next) {
  res.render('main/cart-empty', {title:'home'});
});


module.exports = router;
