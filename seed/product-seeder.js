var Product = require('../models/product');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('localhost:27017/shopping');

var products = [ 
	new Product({
	imagePath: 'http://www.gadgetninja.in/wp-content/uploads/2015/09/letv.jpg',
	title: 'One +3',
	description: 'Amazing gazetted smart phone!!!!',
	price: 19000}),
	new Product({
	imagePath: 'https://gigaom.com/wp-content/uploads/sites/1/2013/10/lg-g-flex-curved-640x426.jpg',
	title: 'Another one from LG',
	description: 'LG smart phone',
	price: 10000}),
	new Product({
	imagePath: 'http://cdn.xyloor.com/id/Micromax-Yu-Yureka-4G.jpg',
	title: 'Micromax YU-Yureka ',
	description: 'Made in India For Indians',
	price: 12000}),
	new Product({
	imagePath: 'http://img.techentice.com/img/priv.jpg',
	title: 'Black Berry Mobile',
	description: 'Latest smartphone from Blackberry Inc',
	price: 39000}),
	new Product({
	imagePath: 'http://www.sagmart.com/other_images/Samsung-Galaxy-S5.jpg',
	title: 'SamSung Galaxy S5',
	description: 'Samsung Mobile',
	price: 48000}),
	new Product({
	imagePath: 'http://cdn.gsmarena.com/imgroot/news/15/10/letv-le-1s-official/inline/-728/gsmarena_005.jpg',
	title: 'LeEco 1s',
	description: 'LeEco Made in China cool smartphone',
	price: 8500}),
];


var done = 0;
for (var i=0; i<products.length; i++){
	products[i].save(function(err, data){
		done++;
		if (done === products.length){
			exit();
		}
	});
}

function exit(){
	mongoose.disconnect();
}