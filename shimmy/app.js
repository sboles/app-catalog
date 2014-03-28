/**
 * Module dependencies.
 */

var express  = require('express'),
	path     = require('path'),
	config   = require('./config'),
	routes   = require('./routes');



var app = express();


function apiProxy(pattern, host, port, username, password) {
	var httpProxy = require('http-proxy');
	var base64Encode = require('base64').encode;
	var Buffer = require('buffer').Buffer;
    var scheme = (443 === port) ? 'https' : 'http';
    var target = scheme + '://' + host + ':' + port;
    console.log('Using ' + scheme + ' scheme for proxy');

	return function(req,res,next) {
		if (req.url.match(pattern)) {
			req.url = req.url.substring('/proxy'.length);
			var userPass = base64Encode(new Buffer(username + ':' + password));
			req.headers.authorization = 'Basic ' + userPass;

            req.headers.host = host;
            req.headers.origin = target;
            req.headers.referer = target;
            console.log(JSON.stringify(req.headers, null, 2));
            
			var proxy = httpProxy.createProxyServer({
				target: target,
                https: true
			});
			proxy.on('end', function(req) {
			  console.log('The request was proxied for ' + req.url);
			});
			proxy.web(req, res,{}, function(e) {
				console.log(e.toString());
			});
		} else {
			next();
		}
	};
}

/**
 * Express configuration.
 */
var argv = require('optimist')
	.usage('Usage: $0 --proxyUser [username "rallyuser"] --proxyPassword [password "rallypassword"] --proxyHost [host "localhost"] --proxyPort [number "80"]')
	.default({ proxyHost : 'localhost', proxyPort : 80, proxyUser : 'rallyuser', proxyPassword: 'rallypassword' })
    // .demand(['proxyPassword','proxyUser'])
    .argv;


var applicationPort = app.get('port') || 3000;

console.log('==================================================================');
console.log(' Proxy Configuration');
console.log('  proxyUser     : ' + argv.proxyUser);
console.log('  proxyPassword : ' + argv.proxyPassword);
console.log('  proxyPort     : ' + argv.proxyPort);
console.log('  proxyHost     : ' + argv.proxyHost);
console.log(' General Configuration');
console.log('  application port   : ' + applicationPort);
console.log('==================================================================');


app.set('port', config.server.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(apiProxy(/\/proxy\/.*/, argv.proxyHost,argv.proxyPort,argv.proxyUser,argv.proxyPassword));
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
console.log('Using Mountpoint ', mountpoint);
app.use(express.static(mountpoint));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res) {
  res.status(404).render('404', {title: 'Not Found :('});
});
app.use(express.errorHandler());

routes(app);

app.listen(applicationPort, function () {
  console.log('Express server listening on port ' + applicationPort);
});
