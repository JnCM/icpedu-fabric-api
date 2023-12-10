require('dotenv').config();
const express = require('express');

const app = express();

// REST API connection
const CertificatesRouter = require('./certificates/routes.config');

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length, x-secret-key');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range, x-secret-key');
    res.set('x-secret-key', process.env.SECRET_KEY);
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});

app.use(express.json());
CertificatesRouter.routesConfig(app);

app.listen(parseInt(process.env.PORT), function () {
    console.log('API listening at port %s', parseInt(process.env.PORT));
});