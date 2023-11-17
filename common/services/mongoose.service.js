const mongoose = require('mongoose');
let count = 0;

const options = {
    autoIndex: false // Don't build indexes
};

const connectWithRetry = () => {
    console.log('MongoDB connection with retry')
    mongoose.connect("mongodb://localhost:27017/digicert-api", options).then(()=>{
        console.log('MongoDB is connected')
    }).catch(err=>{
        console.log(err);
        console.log('MongoDB connection unsuccessful, retry after 5 seconds. ', ++count);
        setTimeout(connectWithRetry, 5000)
    })
};

connectWithRetry();

exports.mongoose = mongoose;
