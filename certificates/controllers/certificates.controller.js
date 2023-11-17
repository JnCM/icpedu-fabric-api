const CertificateModel = require('../models/certificates.model');
const FabricConnect = require('../../fabric.connect');

exports.insert = (req, res) => {
    let today = new Date();
    req.body.createdAt = today.toISOString();
    req.body.updatedAt = today.toISOString();

    CertificateModel.createCertificate(req.body)
        .then(async (result) => {
            
            let network = new FabricConnect();
            await network.connectFabric();
            await network.registerCertificate(result._id.toString(), req.body.serialNumber, req.body.createdAt, req.body.expiresAt);
            network.closeConnection();

            res.status(201).send({id: result._id});
        });
};

exports.list = async (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;

    let network = new FabricConnect();
    await network.connectFabric();
    const result = await network.getAllCertificates();
    network.closeConnection();
    console.log('*** Result:', result);

    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    CertificateModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getById = async (req, res) => {

    let network = new FabricConnect();
    await network.connectFabric();
    const result = await network.getCertificate(req.params.certificateId);
    network.closeConnection();
    console.log('*** Result:', result);

    CertificateModel.findById(req.params.certificateId)
        .then((result) => {
            res.status(200).send(result);
        });
};

exports.patchById = async (req, res) => {
    let today = new Date();
    let certificate;
    req.body.updatedAt = today.toISOString();

    certificate = await CertificateModel.findById(req.params.certificateId);

    let network = new FabricConnect();
    await network.connectFabric();
    await network.renewCertificate(
        req.params.certificateId,
        certificate.serialNumber,
        certificate.createdAt,
        req.body.expiresAt,
        req.body.updatedAt
    );
    network.closeConnection();

    CertificateModel.patchCertificate(req.params.certificateId, req.body)
        .then((result) => {
            res.status(204).send(result);
        });

};
