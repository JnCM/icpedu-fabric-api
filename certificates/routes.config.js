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
    app.get('/certificates/:certificateId', [
        ValidationMiddleware.validSecretKey,
        CertificatesController.getById
    ]);
    app.patch('/certificates/:certificateId', [
        ValidationMiddleware.validSecretKey,
        CertificatesController.patchById
    ]);
};
