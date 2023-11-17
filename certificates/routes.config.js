const CertificatesController = require('./controllers/certificates.controller');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');

exports.routesConfig = function (app) {
    app.post('/certificates', [
        ValidationMiddleware.validJWTNeeded,
        CertificatesController.insert
    ]);
    app.get('/certificates', [
        ValidationMiddleware.validJWTNeeded,
        CertificatesController.list
    ]);
    app.get('/certificates/:certificateId', [
        ValidationMiddleware.validJWTNeeded,
        CertificatesController.getById
    ]);
    app.patch('/certificates/:certificateId', [
        ValidationMiddleware.validJWTNeeded,
        CertificatesController.patchById
    ]);
};
