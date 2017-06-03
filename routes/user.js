var csrf = require('csurf');
var http = require('http');
var https = require('https');
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
		rep.render('user/profile', { orders: orders, 
									 user: req.user.email.split('@')[0].toUpperCase()
		});
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

router.post('/ssignin', function(req, rep) {
		console.log('handling signin');
		console.log(req.csrfToken());
        verifyRecaptcha(req.body["g-recaptcha-response"], function(success) {
        		console.log(success);
                if (success) {
                        //rep.end("Success!");
                        // TODO: do registration using params in req.body
                        console.log('handling success captcha authentication');
                        passport.authenticate('local.signin', {
							failureRedirect: '/user/signin',
							failureFlash: true
						}), function(req, rep, next){
						console.log('passport authentication done');
						if (req.session.oldUrl){
							var oldUrl = req.session.oldUrl;
							req.session.oldUrl = null;
							return rep.redirect(oldUrl);
						}
						rep.redirect('/user/profile')}
                } else {
                       rep.end("Captcha failed, sorry.");
                        // TODO: take them back to the previous page
                        // and for the love of everyone, restore their inputs
                }
    });
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

var SECRET = "6Lf6MiMUAAAAAITkPa-SME0g2F9hichphptF1AQf";

// Helper function to make API call to recatpcha and check response
function verifyRecaptcha(key, callback) {
        https.get("https://www.google.com/recaptcha/api/siteverify?secret=" + SECRET + "&response=" + key, function(res) {
                var data = "";
                res.on('data', function (chunk) {
                        data += chunk.toString();
                        console.log('on data ----' + data);
                });
                res.on('end', function() {
                        try {
                                var parsedData = JSON.parse(data);
                        		console.log('on data end ----' + parsedData);
                                callback(parsedData.success);
                        } catch (e) {
                        		console.log('sending false ' + e);
                                callback(false);
                        }
                });
        });
}