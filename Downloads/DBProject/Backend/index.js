const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const app = express();
const userRoute = require('./Route/user');
const diaryRoute = require('./Route/diary');
require('dotenv').config();
const PORT = process.env.PORT || 5000;
mongoose.connect('mongodb+srv://xyzDeath:UD2IsZTTPqTdzsly@cluster0.rslza.mongodb.net/cs4620projectdb?retryWrites=true&w=majority', {useNewUrlParser: true});
const db = mongoose.connection;
db.once('open', () => console.log('db connected'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 24 * 60 * 60 * 1000
        // expires : 60000000
    }
}))
app.use(passport.initialize());
app.use(passport.session());
app.use('/user', userRoute);
app.use('/diary', diaryRoute);


app.listen(PORT, () => console.log('Server started'));