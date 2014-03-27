var httpProxy = require('http-proxy');
var _ = require('underscore');



var base64Encode = require('base64').encode;
var Buffer = require('buffer').Buffer;


console.log('loading controllers....');
exports.proxy = function (req, res) {
	var proxy = httpProxy.createProxyServer({
		target:'http://localhost:80',
		headers: {
			host: 'localhost'
		}
	});
	proxy.on('end', function(req) {
	  console.log('The request was proxied for ' + req.url);
	});

	console.log('proxying ' + req.url);
	// var host = 'localhost';
	// var port = 80;
	_.each(req.headers, function(v,k) {
		console.log('Header ' + k + '->' + v);
	});

	var userPass = base64Encode(new Buffer('tshick@rallydev.com:H@k0date'));
	console.log('Basic ' + userPass);
	//req.headers.authorization = 'Basic ' + userPass;
	//req.headers.accept = 'application/json, text/javascript';
	//req.headers.aeferer = null;
	//req.headers.arigin = 'localhost';
	//req.headers.aost = 'localhost';
	//req.headers.referer = 'http://localhost';


	//req.url = req.url.substring('/proxy'.length);
	console.log('New Proxied URL', req.url);
	console.log('immediately prior to send');
	_.each(req.headers, function(v,k) {
		console.log('Header ' + k + '->' + v);
	});
	proxy.web(req, res, {},
		function(e) {
			console.log(e.toString());
			res.write(e.stack);
		});
};
exports.index = function (req, res) {
    res.render('index', {
      title: 'shimmy'
    });
};
