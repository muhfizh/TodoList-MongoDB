const mongoDB = require('mongoose');

const UserPassSchema = mongoDB.Schema({
    Username: {
        type: String,
        required: true
    },
    Password: String
});
const UserPass = mongoDB.model('UserPass', UserPassSchema);

module.exports = UserPass;