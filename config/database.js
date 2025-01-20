const mongoDB = require('mongoose');
require('dotenv').config();

if (!process.env.MONGODB_URL) {
    throw new Error('MONGO_URL belum didefinisikan di file .env');
}

mongoDB.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true });

module.exports = mongoDB;