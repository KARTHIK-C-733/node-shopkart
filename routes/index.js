var express = require('express');
var csrf = require('csurf');
var passport = require('passport');
var router = express.Router();
var Product = require('../models/product');
var csrfProtection = csrf();
router.use(csrfProtection);

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


router.get('/user/signup', function(req, rep, next){
	var messages = req.flash('error');
	//console.log(messages);
	rep.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});


/* POST user signup page. */
router.post('/user/signup', passport.authenticate('local.signup', {
	successRedirect: '/user/profile',
	failureRedirect: '/user/signup',
	failureFlash: true
}));


router.get('/user/profile', function(req, rep, next){
	rep.render('user/profile');
});


router.get('/user/signin', function(req, rep, next){
	var messages = req.flash('error');
	//console.log(messages);
	rep.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/user/signin', passport.authenticate('local.signin', {
	successRedirect: '/user/profile',
	failureRedirect: '/user/signin',
	failureFlash: true
}));

module.exports = router;
