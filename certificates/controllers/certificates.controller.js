const crypto = require('crypto');
const FabricConnect = require('../../fabric.connect');

exports.insert = async (req, res) => {
    try{
        const hashString = req.body.hashString;

        if(process.env.ENVIRONMENT === "PRODUCTION"){
            let network = new FabricConnect();
            await network.connectFabric();
            await network.saveHash(hashString);
            network.closeConnection();
        }

        res.status(201).send({status: "success", hashSaved: hashString});
    }catch(err){
        console.log(err);
        res.status(400).send({msg: "Bad request!"});
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
        console.log(err);
        res.status(400).send({msg: "Bad request!"});
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
        console.log(err);
        res.status(400).send({msg: "Bad request!"});
    }
};
