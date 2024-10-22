const FabricConnect = require('../../fabric.connect');
const logger = require('../../logger');

exports.insert = async (req, res) => {
    try{
        const hashString = req.body.hashString;

        let network = new FabricConnect();
        await network.connectFabric();
        const result = await network.saveHash(hashString);
        network.closeConnection();

        res.status(201).send(result);
    }catch(err){
        if (Object.hasOwn(err, 'details')) {
            if(err.details.length > 0){
                logger.error(`Error: ${err.details[0].message}`);
                res.status(400).send({
                    msg: "Bad request!",
                    description: err.details[0].message
                });
            }else{
                logger.error(`Error: ${err.message}`);
                res.status(400).send({
                    msg: "Bad request!",
                    description: err.message
                });
            }
        }else{
            logger.error(`Error: ${err.message}`);
            res.status(400).send({
                msg: "Bad request!",
                description: err.message
            });
        }
    }
    
};

exports.list = async (req, res) => {
    try{
        let network = new FabricConnect();
        await network.connectFabric();
        const result = await network.getAllHashes();
        network.closeConnection();

        res.status(200).send(result);
    }catch(err){
        logger.error(`Error: ${err.message}`);
        res.status(400).send({
            msg: "Bad request!",
            description: err.message
        });
    }
};

exports.getById = async (req, res) => {
    try{
        let network = new FabricConnect();
        await network.connectFabric();
        const result = await network.getHash(req.params.hashString);
        network.closeConnection();
        res.status(200).send(result);
    }catch(err){
        logger.error(`Error: ${err.message}`);
        res.status(400).send({
            msg: "Bad request!",
            description: err.message
        });
    }
};
