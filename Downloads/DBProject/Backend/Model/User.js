const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName: {type: String, required: true, default: null},
    lastName: {type: String, required: true, default: null},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    date: {type: Date, default: Date.now}
});

module.exports = Users = mongoose.model('user', userSchema);