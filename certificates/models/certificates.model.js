const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const certificateSchema = new Schema({
    serialNumber: String,
    createdAt: String,
    expiresAt: String,
    updatedAt: String
});

certificateSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
certificateSchema.set('toJSON', {
    virtuals: true
});

certificateSchema.findById = function (cb) {
    return this.model('Certificates').find({id: this.id}, cb);
};

const Certificate = mongoose.model('Certificates', certificateSchema);

exports.findBySerialNumber = (serialNumber) => {
    return Certificate.find({serialNumber: serialNumber});
};

exports.findById = (id) => {
    return Certificate.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createCertificate = (certificateData) => {
    const certificate = new Certificate(certificateData);
    return certificate.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Certificate.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec().then(function (users) {
                resolve(users);
            }).catch(function (err) {
                reject(err);
            })
    });
};

exports.patchCertificate = (id, certificateData) => {
    return Certificate.findOneAndUpdate({
        _id: id
    }, certificateData);
};

exports.removeById = (certificateId) => {
    return new Promise((resolve, reject) => {
        Certificate.deleteMany({_id: certificateId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};
