var app = require('../app');

exports.index = function (req, res) {
    res.render('index', {
      title: 'shimmy'
    });
};
exports.dev = function(req,res) {
    res.render('dev', {
      title: 'Rally Analytics 2.0 Development',
      frolic: req.app.frolic
    });
};
