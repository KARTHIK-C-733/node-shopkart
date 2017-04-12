var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');


/* GET home page. */
router.get('/', function(req, res, next) {
	var products = Product.find(function(err, data){

		//console.log(data);
		var  productsChunk = [];
		var chunkSize = 3;
		for (var i = 0; i <= data.length; i += chunkSize ){
			productsChunk.push(data.slice(i, i + chunkSize));
		}

		//console.log(productsChunk);
		res.render('shop/index', { title: 'Node Shop-Kart', products: productsChunk });
	});
});

router.get('/add-to-cart/:id', function(req, rep, next){
	var productId = req.params.id;
	var cart = new Cart(req.session.cart? req.session.cart: {});

	Product.findById(productId, function(err, product){
		if (err){
			return rep.redirect('/');
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		console.log(req.session.cart);
		rep.redirect('/');
	});
});


router.get('/shopping-cart', function(req, rep, next){
	if (!req.session.cart){
		console.log('handling no items in cart');
		return rep.render('shop/shopping-cart', {products:null})
	}
	var cart = new Cart(req.session.cart);
	return rep.render('shop/shopping-cart', {products:cart.generateArray(), totalPrice: cart.totalPrice});
});

module.exports = router;
