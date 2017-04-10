var Product = require('../models/product');
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/shopping');

var products = [ 
	new Product({
	imagePath: 'https://www.macobserver.com/wp-content/uploads/2016/06/google-smartphone.jpg',
	title: 'Google Pixel',
	description: 'Very first android phone of Alphabet Inc!!!!',
	price: 12000}),
	new Product({
	imagePath: 'http://gadgetfix.com/blogadmin/wp-content/uploads/2016/07/Orange-County-CA-Mobile-Parts-Supplier-Smartphone-Pros-Cons.png',
	title: 'Orange Country CA Mobile',
	description: 'CA Mobile by Orange',
	price: 112000}),
	new Product({
	imagePath: 'https://static.acer.com/up/Resource/Acer/Smartphones/Liquid%20Z630S/Images/20151001/Acer-smartphone-Liquid-Z630S-Black-gold-preview.png',
	title: 'Acer Mobile',
	description: 'Make in India mobile',
	price: 1200}),
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