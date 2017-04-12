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
	title: 'HTC Mobile',
	description: 'Make in India mobile',
	price: 1200}),
	new Product({
	imagePath: 'http://article.images.consumerreports.org/prod/content/dam/cro/news_articles/Electronics/CR-ELectronics-Smartphone-Battery-Life-Motorola-Droid-Turbo-BN-II-2-16',
	title: 'Moto',
	description: 'Moto by Lenovo and developed by Google',
	price: 1800}),
	new Product({
	imagePath: 'http://cdn01.androidauthority.net/wp-content/uploads/2014/10/Honor-6-white-710x310.png',
	title: 'HTC',
	description: 'HTC Latest',
	price: 1800}),
	new Product({
	imagePath: 'http://assets.reviews.com/uploads/2015/09/18190915/Smartphone1.jpg',
	title: 'Apple iPhone 7',
	description: 'Latest from the Apple Inc',
	price: 72000}),
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