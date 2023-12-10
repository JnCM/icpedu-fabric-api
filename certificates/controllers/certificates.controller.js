const crypto = require('crypto');
const FabricConnect = require('../../fabric.connect');

exports.insert = async (req, res) => {
    let today = new Date();
    req.body.createdAt = today.toISOString();
    const blockchainId = crypto.createHash('md5').update(req.body.serialNumber).digest('hex');

    let network = new FabricConnect();
    await network.connectFabric();
    await network.registerCertificate(blockchainId, req.body.serialNumber, req.body.createdAt, req.body.expiresAt);
    network.closeConnection();

    res.status(201).send({blockchainId: blockchainId});
};

exports.list = async (req, res) => {
    let network = new FabricConnect();
    await network.connectFabric();
    const result = await network.getAllCertificates();
    network.closeConnection();
    res.status(200).send(result);
};

exports.getById = async (req, res) => {
    let network = new FabricConnect();
    await network.connectFabric();
    const result = await network.getCertificate(req.params.certificateId);
    network.closeConnection();
    res.status(200).send(result);
};

exports.patchById = async (req, res) => {
    let today = new Date();
    let certificate;
    req.body.updatedAt = today.toISOString();
    
    let network = new FabricConnect();
    await network.connectFabric();
    certificate = await network.getCertificate(req.params.certificateId);
    await network.renewCertificate(
        req.params.certificateId,
        certificate.SerialNumber,
        certificate.CreatedAt,
        req.body.expiresAt,
        req.body.updatedAt
    );
    network.closeConnection();
    res.status(204).send();
};
