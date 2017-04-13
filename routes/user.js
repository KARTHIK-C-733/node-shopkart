var csrf = require('csurf');
var passport = require('passport');
var express = require('express');
var router = express.Router();
var Order = require('../models/order');
var Cart = require('../models/cart');

var csrfProtection = csrf();
router.use(csrfProtection);


/* common route */
router.get('/profile', loginRequired, function(req, rep, next){
	Order.find({user: req.user}, function(err, orders){
		if (err){
			return rep.write('Error!');
		}
		var cart;
		orders.forEach(function(order){
			cart = new Cart(order.cart);
			order.items = cart.generateArray();
		});
		rep.render('user/profile', {orders: orders});
	});
});

router.get('/logout', loginRequired, function(req, rep, next){
	req.logout();
	rep.redirect('/');
});

router.use('/', notLoggedIn, function(req, rep, next){
	next();
});

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


/* GET routes */
router.get('/signup', function(req, rep, next){
	var messages = req.flash('error');
	//console.log(messages);
	rep.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.get('/signin', function(req, rep, next){
	var messages = req.flash('error');
	//console.log(messages);
	return rep.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});


/* POST routes */
router.post('/signup', passport.authenticate('local.signup', {
	failureRedirect: '/user/signup',
	failureFlash: true
	}),
	function(req, rep, next){
		if (req.session.oldUrl){
			var oldUrl = req.session.oldUrl;
			req.session.oldUrl = null;
			return rep.redirect(oldUrl);
		}
		rep.redirect('/user/profile')
});

router.post('/signin', passport.authenticate('local.signin', {
	failureRedirect: '/user/signin',
	failureFlash: true
	}),
	function(req, rep, next){
		if (req.session.oldUrl){
			var oldUrl = req.session.oldUrl;
			req.session.oldUrl = null;
			return rep.redirect(oldUrl);
		}
		rep.redirect('/user/profile')
});

module.exports = router;

function loginRequired(req, rep, next){
	if (req.isAuthenticated()){
		return next();
	}
	rep.redirect('/');
}

function notLoggedIn(req, rep, next){
	if (!req.isAuthenticated()){
		return next();
	}
	rep.redirect('/');
}