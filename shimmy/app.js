/**
 * Module dependencies.
 */

var express  = require('express'),
    path     = require('path'),
    mongoose = require('mongoose'),
    config   = require('./config'),
    routes   = require('./routes');
var httpProxy = require('http-proxy');



mongoose.connect(config.database.url);
mongoose.connection.on('error', function () {
  console.log('mongodb connection error');
});

var app = express();


function apiProxy(pattern, host, port) {

	return function(req,res,next) {
		console.log("CHAIN!!!");
    	if (req.url.match(pattern)) {
    		console.log("MATCH");
			req.url = req.url.substring('/proxy'.length);

			var proxy = httpProxy.createProxyServer({
				target:'http://localhost:80',
				headers: {
					host: 'localhost'
				}
			});
			proxy.on('end', function(req) {
			  console.log('The request was proxied for ' + req.url);
			});
      		proxy.web(req, res,{}, function(e) {
      			console.log(e.toString());
      		});
      	} else {
      		next()
  		}
	}
}

/**
 * Express configuration.
 */
app.set('port', config.server.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(apiProxy(/\/proxy\/.*/, 'localhost',80))
app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.session({ secret: 'your secret code' }));
app.use(app.router);

var mountpoint = path.join(__dirname, '../src/apps');
console.log('Mountpoint', mountpoint);
app.use(express.static(mountpoint));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res) {
  res.status(404).render('404', {title: 'Not Found :('});
});
app.use(express.errorHandler());

routes(app);

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
