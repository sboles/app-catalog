var controllers = require('../controllers');

module.exports = function (app) {
    app.get('/proxy', controllers.proxy);
    app.get('/', controllers.index);
};
