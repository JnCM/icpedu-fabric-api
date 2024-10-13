const FabricConnect = require('../../fabric.connect');
const logger = require('../../logger');

exports.insert = async (req, res) => {
    try{
        const hashString = req.body.hashString;

        let network = new FabricConnect();
        await network.connectFabric();
        result = await network.saveHash(hashString);
        network.closeConnection();

        res.status(201).send(result);
    }catch(err){
        if (Object.hasOwn(err, 'details')) {
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
    }
    
};

exports.list = async (req, res) => {
    try{
        let result;
        if(process.env.ENVIRONMENT === "PRODUCTION"){
            let network = new FabricConnect();
            await network.connectFabric();
            result = await network.getAllHashes();
            network.closeConnection();
        }else{
            result = [{hashString: "OSPiKPamEvO3ekkf2oSjUtOPKOgd2Wh5"}];
        }

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
        let result;
        if(process.env.ENVIRONMENT === "PRODUCTION"){
            let network = new FabricConnect();
            await network.connectFabric();
            result = await network.getHash(req.params.hashString);
            network.closeConnection();
        }else{
            result = {hashString: req.params.hashString};
        }
        res.status(200).send(result);
    }catch(err){
        logger.error(`Error: ${err.message}`);
        res.status(400).send({
            msg: "Bad request!",
            description: err.message
        });
    }
};
