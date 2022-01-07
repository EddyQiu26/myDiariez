const express = require('express');
const router = express.Router();
const diaryModel = require('../Model/Diary');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://xyzDeath:UD2IsZTTPqTdzsly@cluster0.rslza.mongodb.net/cs4620projectdb?retryWrites=true&w=majority', {useNewUrlParser: true});
const db = mongoose.connection;
router.get('/all', (req,res) => {
    diaryModel.find({}).then(r => {
        res.json({r});
    })
})

router.post('/filter', (req,res) => {
    if(req.body.filterCategory === 'all'){
        db.collection('diaries').dropIndexes(['content_text', 'title_text', 'content_text_title_text', 'title_text_content_text']).then(() => {
            if(req.body.fieldSelect === 'both'){
                db.collection('diaries').createIndex({title:"text", content: 'text'}).then(() => {
                    if(req.body.fieldScopeSelect === 'contains'){
                        diaryModel.find({$and: [
                            {"ownerId":req.body.userId},
                            {createdAt: {$gte: new Date((new Date(req.body.dateSelectFrom)).toISOString()), $lte: new Date((new Date(req.body.dateSelectTo).toISOString()))}}, 
                            {$text: {$search: req.body.keywords}}
                        ]}).then(results => {
                            res.json({results, success: true});
                        })
                    } else if(req.body.fieldScopeSelect === 'exact'){
                        diaryModel.find({$and: [
                            {"ownerId":req.body.userId},
                            {createdAt: {$gte: new Date((new Date(req.body.dateSelectFrom)).toISOString()), $lte: new Date((new Date(req.body.dateSelectTo).toISOString()))}}, 
                            {$text: {$search: `"${req.body.keywords}"`}}
                        ]}).then(results => {
                            res.json({results, success: true});
                        })
                    } else {
                        res.json({success: false, message: "Invalid filter option", results: []});
                    }
                })
            } else if(req.body.fieldSelect === 'content'){
                db.collection('diaries').createIndex({content: 'text'}).then(() => {
                    if(req.body.fieldScopeSelect === 'contains'){
                        diaryModel.find({$and: [
                            {"ownerId":req.body.userId},
                            {createdAt: {$gte: new Date((new Date(req.body.dateSelectFrom)).toISOString()), $lte: new Date((new Date(req.body.dateSelectTo).toISOString()))}}, 
                            {$text: {$search: req.body.keywords}}
                        ]}).then(results => {
                            res.json({results, success: true});
                        })
                    } else if(req.body.fieldScopeSelect === 'exact'){
                        diaryModel.find({$and: [
                            {"ownerId":req.body.userId},
                            {createdAt: {$gte: new Date((new Date(req.body.dateSelectFrom)).toISOString()), $lte: new Date((new Date(req.body.dateSelectTo).toISOString()))}}, 
                            {$text: {$search: `"${req.body.keywords}"`}}
                        ]}).then(results => {
                            res.json({results, success: true});
                        })
                    } else {
                        res.json({success: false, message: "Invalid filter option", results: []});
                    }
                })
            } else if(req.body.fieldSelect === 'title'){
                db.collection('diaries').createIndex({title:"text"}).then(() => {
                    if(req.body.fieldScopeSelect === 'contains'){
                        diaryModel.find({$and: [
                            {"ownerId":req.body.userId},
                            {createdAt: {$gte: new Date((new Date(req.body.dateSelectFrom)).toISOString()), $lte: new Date((new Date(req.body.dateSelectTo).toISOString()))}}, 
                            {$text: {$search: req.body.keywords}}
                        ]}).then(results => {
                            res.json({results, success: true});
                        })
                    } else if(req.body.fieldScopeSelect === 'exact'){
                        diaryModel.find({$and: [
                            {"ownerId":req.body.userId},
                            {createdAt: {$gte: new Date((new Date(req.body.dateSelectFrom)).toISOString()), $lte: new Date((new Date(req.body.dateSelectTo).toISOString()))}}, 
                            {$text: {$search: `"${req.body.keywords}"`}}
                        ]}).then(results => {
                            res.json({results, success: true});
                        })
                    } else {
                        res.json({success: false, message: "Invalid filter option", results: []});
                    }
                })
            } else {
                res.json({message: "Invalid filter option", success: false, results: []})
            }
        })
    } else if (req.body.filterCategory === 'tc') {
        db.collection('diaries').dropIndexes(['content_text', 'title_text', 'content_text_title_text', 'title_text_content_text']).then(() => {
            if(req.body.fieldSelect === 'both'){
                db.collection('diaries').createIndex({title:"text", content: 'text'}).then(() => {
                    if(req.body.fieldScopeSelect === 'contains'){
                        diaryModel.find({$and: [
                            {"ownerId":req.body.userId},
                            {$text: {$search: req.body.keywords}}
                        ]}).then(results => {
                            res.json({results, success: true});
                        })
                    } else if(req.body.fieldScopeSelect === 'exact'){
                        diaryModel.find({$and: [
                            {"ownerId":req.body.userId},
                            {$text: {$search: `"${req.body.keywords}"`}}
                        ]}).then(results => {
                            res.json({results, success: true});
                        })
                    } else {
                        res.json({success: false, message: "Invalid filter option", results: []});
                    }
                })
            } else if(req.body.fieldSelect === 'content'){
                db.collection('diaries').createIndex({content: 'text'}).then(() => {
                    if(req.body.fieldScopeSelect === 'contains'){
                        diaryModel.find({$and: [
                            {"ownerId":req.body.userId},
                            {$text: {$search: req.body.keywords}}
                        ]}).then(results => {
                            res.json({results, success: true});
                        })
                    } else if(req.body.fieldScopeSelect === 'exact'){
                        diaryModel.find({$and: [
                            {"ownerId":req.body.userId},
                            {$text: {$search: `"${req.body.keywords}"`}}
                        ]}).then(results => {
                            res.json({results, success: true});
                        })
                    } else {
                        res.json({success: false, message: "Invalid filter option", results: []});
                    }
                })
            } else if(req.body.fieldSelect === 'title'){
                db.collection('diaries').createIndex({title:"text"}).then(() => {
                    if(req.body.fieldScopeSelect === 'contains'){
                        diaryModel.find({$and: [
                            {"ownerId":req.body.userId},
                            {$text: {$search: req.body.keywords}}
                        ]}).then(results => {
                            res.json({results, success: true});
                        })
                    } else if(req.body.fieldScopeSelect === 'exact'){
                        diaryModel.find({$and: [
                            {"ownerId":req.body.userId},
                            {$text: {$search: `"${req.body.keywords}"`}}
                        ]}).then(results => {
                            res.json({results, success: true});
                        })
                    } else {
                        res.json({success: false, message: "Invalid filter option", results: []});
                    }
                })
            } else {
                res.json({message: "Invalid filter option", success: false, results: []})
            }
        })
    } else if(req.body.filterCategory === 'date') {
        diaryModel.find({$and: [{"ownerId": req.body.userId}, {createdAt: {$gte: new Date((new Date(req.body.dateSelectFrom)).toISOString()), $lte: new Date((new Date(req.body.dateSelectTo).toISOString()))}}]})
        .then((results, err) => {
            if(err){
                return res.json({message: err.message, success: false, results: []});
            }
            res.json({results, success: true});
        })
    } else {
        res.json({success: false, message: "Invalid filter option", results: []});
    }
})

router.get('/entries', (req, res) => {
    if(req.user){
        diaryModel.find({"ownerId": req.user._id}).then(entries => {
            res.json({entries, successful: true});
        })
    } else {
        res.json({message: 'Cannot retrieve entries because user does not exist', successful: false});
    }
})

router.delete('/delete/:id', (req, res) => {
    if(req.user){
        diaryModel.findByIdAndDelete(req.params.id).then((err, doc) => {
            if(err) {
                res.json({message: err.message, deleted: false})
            } else {
                res.json({message: 'Entry successfully deleted', delete:true});
            }
        })
    } else {
        res.json({message: 'Cannot delete entries because user does not exist', deleted: false});
    }
})

router.put('/edit/:id', (req, res) => {
    const {dTitle, dDate, dTime, dRecipient, dContent, dSignature, dImageURL, ownerId} = req.body;
    const newTitle = (dTitle.length === 0) ? 'No Title' : dTitle;
    const newRecipient = (dRecipient.length === 0) ? 'Diary' : dRecipient;
    const newSignature = (dSignature.length === 0) ? 'User' : dSignature;
    diaryModel.findByIdAndUpdate(req.params.id, {$set: {
        title: newTitle,
        date: dDate,
        time: dTime,
        recipient: newRecipient,
        content: dContent,
        signature: newSignature,
        imgURL: dImageURL,
        ownerId: ownerId 
    }}, {new: true}, (err, doc) => {
        if(err) {
            res.json({message: err.message, saved: false})
        } else {
            res.json({message: 'Successfully Updated!', saved: true});
        }
    })
});

router.post('/upload', async (req, res) => {
    const day = (new Date()).getDate();
    const year = (new Date()).getFullYear();
    const month = (new Date()).getMonth() + 1;
    const createdAt = new Date(`${year}-${month}-${day}`);
    const dTitle = (req.body.dTitle.length === 0) ? 'No Title' : req.body.dTitle;
    const dRecipient = (req.body.dRecipient.length === 0) ? 'Diary' : req.body.dRecipient;
    const dSignature = (req.body.dSignature.length === 0) ? 'User' : req.body.dSignature;
    const newDiary = new diaryModel({
        title: dTitle,
        date: req.body.dDate,
        time: req.body.dTime,
        recipient: dRecipient,
        content: req.body.dContent,
        signature: dSignature,
        imgURL: req.body.dImageURL,
        ownerId: req.body.ownerId,
        createdAt: createdAt
    });
    try {
        const uploadRes = await newDiary.save();
        res.json({
            uploadRes,
            message: "Diary entry successfully saved!",
            saved: true
        })
    } catch(err){
        return res.json({message: err.message, saved: false});
    }
})

module.exports = router;