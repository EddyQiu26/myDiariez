const mongoose = require('mongoose');
const diarySchema = new mongoose.Schema({
    title: {type: String, default: "No Title", text: true},
    date: {type: String},
    time: {type: String},
    recipient: {type: String, default: 'Diary'},
    content: {type: String, required: true, text:true},
    signature: {type: String, default: 'User'},
    imgURL: {type: String, default: null},
    ownerId: {type: String, required: true},
    createdAt: {type: Date}
});

module.exports = Diary = mongoose.model('diary', diarySchema);