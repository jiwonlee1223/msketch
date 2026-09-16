// Define Packages

var express = require('express');

var app = express();

var PORT = process.env.PORT || 45581;

var server = app.listen(PORT, function(){

    console.log("M.SKETCH Server Started at :" + PORT);

});

var session = require('express-session');

var flash = require('connect-flash');

var logger = require('morgan');



var fs = require('fs');



var bodyParser   = require('body-parser');

var mongoose = require('mongoose');

var passport = require('passport');

var db = mongoose.connection;



var dbAddress = 'mongodb+srv://CIDRLAB:4558cidr@msketch.qfqb7.mongodb.net/?retryWrites=true&w=majority&appName=MSketch';

// var dbAddress = 'mongodb+srv://nnitgd:bxgfWAeQg6qwgMts@msketchtestcluster.fsve2zd.mongodb.net/?retryWrites=true&w=majority&appName=MSketchTestCluster'

mongoose.connect(dbAddress, { dbName: 'msketch'});

mongoose.Promise = global.Promise;



app.use(logger('dev'));



// DB

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {

    console.log("Mongo DB Connected at " + dbAddress)

});



// Session & Passport

app.use(session({

    secret: 'msketch_cidr',

    resave: false,

    saveUninitialized: true

}));



app.use(passport.initialize());

app.use(passport.session()); //로그인 세션 유지



app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));



// Views

app.set('views', './views');

app.set('view engine', 'ejs');

app.use(express.static(__dirname));

app.use(flash());



require('./config/passport')(passport);

require('./config/routes.js')(app, passport, fs);
