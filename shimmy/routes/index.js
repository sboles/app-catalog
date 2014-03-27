var controllers = require('../controllers');

module.exports = function (app) {
    app.get('/proxyx/*', controllers.proxy);
    app.post('/proxyx/*', controllers.proxy);
    app.get('/', controllers.index);
};
