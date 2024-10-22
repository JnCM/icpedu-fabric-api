require('dotenv').config();
const fs = require('fs/promises');
const grpc = require('@grpc/grpc-js');
const crypto = require('crypto');
const fabric = require('@hyperledger/fabric-gateway');
const logger = require('./logger');

class FabricConnect{
    constructor(){
        this.channelName = process.env.CHANNEL_NAME;
        this.chaincodeName = process.env.CHAINCODE_NAME;
        this.mspId = process.env.MSP_ID;
        this.peerEndpoint = process.env.PEER_ENDPOINT;
        this.peerHostAlias = process.env.PEER_HOST_ALIAS;
        this.keyDirectoryPath = process.env.KEYSTORE_PATH;
        this.certPath = process.env.SIGNCERT_PATH;
        this.tlsCertPath = process.env.PEERTLSCERT_PATH;
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
        const privateKeyPem = await fs.readFile(this.keyDirectoryPath);
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
            evaluateOptions: () => {
                return { deadline: Date.now() + 60000 }; // 1 minute
            },
            endorseOptions: () => {
                return { deadline: Date.now() + 60000 }; // 1 minute
            },
            submitOptions: () => {
                return { deadline: Date.now() + 60000 }; // 1 minute
            },
            commitStatusOptions: () => {
                return { deadline: Date.now() + 60000 }; // 1 minute
            },
        });
        
        this.network = this.gateway.getNetwork(this.channelName);
        this.contract = this.network.getContract(this.chaincodeName);
        logger.info(`Hyperledger Fabric connected successfully!`);
    }

    closeConnection(){
        this.gateway.close();
        this.client.close();
        logger.info(`Connection with Hyperledger Fabric closed successfully!`);
    }

    async getAllHashes(){
        const resultBytes = await this.contract.evaluateTransaction('GetAllHashes');
        const resultJson = this.utf8Decoder.decode(resultBytes);
        let result = JSON.parse(resultJson);
        for (let i = 0; i < result.length; i++) {
            if(result[i].TxTimestamp !== undefined){
                result[i].TxTimestamp = this.toDate(result[i].TxTimestamp);
            }
        }
        logger.info(`Transaction 'GetAllHashes' executed successfully!`);
        return result;
    }

    async getHash(hashString){
        const resultBytes = await this.contract.evaluateTransaction('GetHash', hashString);
        const resultJson = this.utf8Decoder.decode(resultBytes);
        const result = JSON.parse(resultJson);
        result.TxTimestamp = this.toDate(result.TxTimestamp);
        logger.info(`Transaction 'GetHash' executed successfully!`);
        return result;
    }

    async saveHash(hashString){
        logger.info('--> Async Submit Transaction: SaveHash, creates a new hash...');

        const commit = await this.contract.submitAsync('SaveHash', {
            arguments: [hashString],
        });

        logger.info('Waiting for transaction commit');
        const status = await commit.getStatus();
        if (!status.successful) {
            throw new Error(`Transaction ${status.transactionId} failed to commit with status code ${status.code}!`);
        }
        logger.info(`Transaction 'SaveHash' committed successfully!`);
        
        const startBlock = status.blockNumber;
        const events = await this.network.getChaincodeEvents(this.chaincodeName, {startBlock});
        let payloadEvent;
        for await (const event of events) {
            const payload = this.parseJson(event.payload);
            payloadEvent = payload;
            break;
        }
        payloadEvent.TxTimestamp = this.toDate(payloadEvent.TxTimestamp);

        return payloadEvent;
    }

    parseJson(jsonBytes){
        const json = this.utf8Decoder.decode(jsonBytes);
        return JSON.parse(json);
    }

    toDate(timestamp) {
        const milliseconds = (timestamp.seconds.low + ((timestamp.nanos / 1000000) / 1000)) * 1000;
        let dateConverted = new Date(milliseconds);
        return dateConverted;
    }
}

module.exports = FabricConnect;
