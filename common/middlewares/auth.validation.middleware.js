require('dotenv').config();

exports.validSecretKey = (req, res, next) => {
    if (req.headers['x-secret-key']) {
        try {
            let authorization = req.headers['x-secret-key'];
            if (authorization !== process.env.SECRET_KEY) {
                return res.status(401).send({error: 'Invalid Secret key!'});
            } else {
                return next();
            }
        } catch (err) {
            console.log(err);
            return res.status(403).send({error: 'Invalid authorization!'});
        }
    } else {
        return res.status(401).send({error: 'Secret key is missing!'});
    }
};
