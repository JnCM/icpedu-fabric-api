const CertificatesController = require('./controllers/certificates.controller');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');

exports.routesConfig = function (app) {
    app.post('/certificates', [
        ValidationMiddleware.validSecretKey,
        CertificatesController.insert
    ]);
    app.get('/certificates', [
        ValidationMiddleware.validSecretKey,
        CertificatesController.list
    ]);
    app.get('/certificates/:hashString', [
        ValidationMiddleware.validSecretKey,
        CertificatesController.getById
    ]);
};
