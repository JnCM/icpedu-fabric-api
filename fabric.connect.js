require('dotenv').config();
const path = require('path');
const fs = require('fs/promises');
const grpc = require('@grpc/grpc-js');
const crypto = require('crypto');
const fabric = require('@hyperledger/fabric-gateway');

class FabricConnect{
    constructor(){
        this.channelName = process.env.CHANNEL_NAME;
        this.chaincodeName = process.env.CHAINCODE_NAME;
        this.mspId = process.env.MSP_ID;
        this.peerEndpoint = process.env.PEER_ENDPOINT;
        this.peerHostAlias = process.env.PEER_HOST_ALIAS;
        this.cryptoPath = path.resolve(__dirname, 'fabric-credentials');
        this.keyDirectoryPath = path.resolve(this.cryptoPath, 'org-keystore');
        this.certPath = path.resolve(this.cryptoPath, 'org-signcert', 'cert.pem');
        this.tlsCertPath = path.resolve(this.cryptoPath, 'peer-tlscert', 'tlsca-signcert.pem');
        this.utf8Decoder = new TextDecoder();
    }

    async newGrpcConnection(){
        const tlsRootCert = await fs.readFile(this.tlsCertPath);
        const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
        return new grpc.Client(this.peerEndpoint, tlsCredentials, {
            'grpc.ssl_target_name_override': this.peerHostAlias,
        });
    }
    
    async newIdentity(){
        const credentials = await fs.readFile(this.certPath);
        const mspId = this.mspId;
        return { mspId, credentials };
    }
    
    async newSigner(){
        const files = await fs.readdir(this.keyDirectoryPath);
        const keyPath = path.resolve(this.keyDirectoryPath, files[1]);
        const privateKeyPem = await fs.readFile(keyPath);
        const privateKey = crypto.createPrivateKey(privateKeyPem);
        return fabric.signers.newPrivateKeySigner(privateKey);
    }

    async connectFabric(){
        const client = await this.newGrpcConnection();
        this.client = client;
        this.gateway = fabric.connect({
            client,
            identity: await this.newIdentity(),
            signer: await this.newSigner(),
        });
        
        this.network = this.gateway.getNetwork(this.channelName);
        this.contract = this.network.getContract(this.chaincodeName);
        console.log(`*** Hyperledger Fabric connected successfully!`);
    }

    closeConnection(){
        this.gateway.close();
        this.client.close();
        console.log(`*** Connection with Hyperledger Fabric closed successfully!`);
    }

    async getAllCertificates(){
        const resultBytes = await this.contract.evaluateTransaction('GetAllCertificates');
        const resultJson = this.utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        return result;
    }

    async getCertificate(serialNumber){
        const resultBytes = await this.contract.evaluateTransaction('ReadCertificate', serialNumber);
        const resultJson = this.utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        return result;
    }

    async registerCertificate(serialNumber, createdAt, expiresAt){
        console.log('\n--> Async Submit Transaction: CreateCertificate, creates a new certificate');

        const commit = await this.contract.submitAsync('CreateCertificate', {
            arguments: [serialNumber, createdAt, expiresAt],
        });
        const newCertificate = this.utf8Decoder.decode(commit.getResult());

        console.log(`*** Successfully created a new certificate: ${newCertificate}`);
        console.log('*** Waiting for transaction commit');

        const status = await commit.getStatus();
        if (!status.successful) {
            throw new Error(`Transaction ${status.transactionId} failed to commit with status code ${status.code}!`);
        }

        console.log(`*** Transaction 'CreateCertificate' committed successfully!`);
    }
}

module.exports = FabricConnect;
