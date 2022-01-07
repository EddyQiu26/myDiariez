const express = require('express');
const router = express.Router();
const usersModel = require('../Model/User');
//const bcrypt = require('bcryptjs');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

passport.use(new localStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async (email, password, done) => {
    let user;
        try {
            user = await usersModel.findOne({email});
        } catch (err) {
            return done(err, {message: "Unknown error occured whileing looking for the username"});
        }
        if(!user) {
            return done(null, false, {message: 'Username not found.'})
        }
        if(password === user.password) {
            return done(null, user, {message: 'Authentication succeeded!'})
        } else {
            return done(null, false, {message: "Incorrect password"})
        }
}));

passport.serializeUser(function(user, done){
    done(null, user.id || user._id);
});
passport.deserializeUser(async function(id, done){
    const u = await usersModel.findOne({_id:id});
    done(null, u);
})

router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if(err){ 
            res.json({message: err.message})
            return next(err); 
        }
        if(!user){
            return res.json({message: info.message, isAuth: req.isAuthenticated()}); 
        }
        req.logIn(user, function(err) {
            if(err){ 
                res.json({message: "Unknown error occured while logging in"})
                return next(err); 
            }
            res.json({message: info.message, isAuth: req.isAuthenticated(), firstName: user.firstName, lastName: user.lastName, id: user.id})
        });
    })(req, res, next);
})

function checkAuth(req, res, next){
    if(req.isAuthenticated()){
       // return res.json({message: "Already authenticated", isAuth: true, firstName: req.user.firstName})
       return res.json({message: "Already authenticated", isAuth: req.isAuthenticated(), firstName: req.user.firstName, id: req.user.id})
    }
    next();
}

router.get('/login', checkAuth, (req,res) => {
    res.json({message: '', isAuth: false});
})

router.post('/register', async (req, res) => {
    let containsCap = false;
    let containsNum = false;
    let containsLowerLetter = false;
    let containsSpChar = false;
    let containsInvalidChar = false;
    try{
        const user = await usersModel.findOne({email: req.body.username});
        if(user) return res.json({message: "Email already exists", registered: false});
        if(req.body.password !== req.body.confirmPassword) return res.json({message: "Passwords do not match", registered: false});
        if(req.body.password.length < 8) return res.json({message: 'Length of your password must be at least 8 characters', registered: false});
        for(let i = 0; i < req.body.password.length; i++){
            if(!containsInvalidChar) containsInvalidChar = (req.body.password.charCodeAt(i) == 44) || (req.body.password.charCodeAt(i) == 34)|| (58 <= req.body.password.charCodeAt(i)) && (req.body.password.charCodeAt(i) <= 62) || (39 <= req.body.password.charCodeAt(i)) && (req.body.password.charCodeAt(i) <= 41) || (req.body.password.charCodeAt(i) === 47) || (91 <= req.body.password.charCodeAt(i)) && (req.body.password.charCodeAt(i) <= 93) || (req.body.password.charCodeAt(i) === 96) || (123 <= req.body.password.charCodeAt(i)) && (req.body.password.charCodeAt(i) <= 126);
            if(!containsCap) containsCap = (65 <= req.body.password.charCodeAt(i)) && (req.body.password.charCodeAt(i) <= 90);
            if(!containsNum) containsNum = (48 <= req.body.password.charCodeAt(i)) && (req.body.password.charCodeAt(i) <= 57);
            if(!containsLowerLetter) containsLowerLetter = (97 <= req.body.password.charCodeAt(i)) && (req.body.password.charCodeAt(i) <= 122);
            if(!containsSpChar) containsSpChar = (35 <= req.body.password.charCodeAt(i) && req.body.password.charCodeAt(i) <= 38) || (63 <= req.body.password.charCodeAt(i) && req.body.password.charCodeAt(i) <= 64) || (94 <= req.body.password.charCodeAt(i) && req.body.password.charCodeAt(i) <= 95) || (42 <= req.body.password.charCodeAt(i) && req.body.password.charCodeAt(i) <= 43) || (45 <= req.body.password.charCodeAt(i) && req.body.password.charCodeAt(i) <= 46);
        }
        if(!containsCap || !containsLowerLetter || !containsNum || !containsSpChar || containsInvalidChar) {
            return res.json({message: 'Password does not meet the indicated requirements', registered: false});
        }
        const newUser = new usersModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,
            email: req.body.username        
        });
        try {
            await newUser.save();
            res.json({
                user : {
                    id: newUser.id,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.username,
                    password: newUser.password
                },
                message: "You are successfully registered! Please login",
                registered: true
            })
        } catch(err){
            return res.json({message: "Error occured while saving user to the database", registered: false});
        }
    }catch(err){
        return res.json({message: "Unknown error occured while finding user", error: err, registered: false})
    }
})

router.post('/signoff', (req,res) => {
    req.session.destroy(err => {
        if(err) {
            console.log(err);
        } else {
            req.logOut();
            req.logout();
            res.clearCookie('connect.sid');
            res.json({message: 'You are now Signed out!', signedOff: true})
        }
    })
})

module.exports = router;