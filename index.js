require('dotenv').config();
const express = require('express');
const logger = require('./logger');
const morgan = require('morgan');

const app = express();

// REST API connection
const CertificatesRouter = require('./certificates/routes.config');

// Log HTTP requests (using 'combined' format)
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Middleware to log each request
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    res.status(500).send('Something went wrong!');
});

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
    logger.info(`API listening at port ${parseInt(process.env.PORT)}`);
});