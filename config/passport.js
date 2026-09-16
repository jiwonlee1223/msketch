// var LocalStrategy = require('passport-local').Strategy
// var User = require('../models/user');

// module.exports = function(passport) {
//     passport.serializeUser(function(user, done) {
//         done(null, user.id);
//     });
//     passport.deserializeUser(function(id, done) {
//         User.findById(id, function(err, user) {
//             done(err, user);
//         });
//     });
//     //프로그램 작성

//     passport.use('signup', new LocalStrategy({
//         usernameField : 'email',
//         passwordField : 'password',
//         passReqToCallback : true
//     },
//     async function(req, email, password, done) {
//         User.findOne({ 'email' : email }, function(err, user) {
//             if (err) return done(err);
//             if (user) {
//                 //return done(null, false);
//                 return done(null, false, req.flash('signupMessage', 'E-mail already exists.'));
//             } else {
//                 var newUser = new User();
//                 newUser.name = req.body.name;
//                 newUser.email = email;
//                 newUser.password = newUser.generateHash(password);
//                 newUser.save(function(err) {
//                     if (err)
//                         throw err;
//                     return done(null, newUser);
//                 });
//             }
//         });
//     }));

//     passport.use('login', new LocalStrategy({
//             usernameField : 'email',
//             passwordField : 'password',
//             passReqToCallback : true
//         },
//         async function(req, email, password, done) {
//             User.findOne({ 'email' : email }, function(err, user) {
//                 if (err)
//                     return done(err);
//                 if (!user)
//                     //return done(null, false);
//                     return done(null, false, req.flash('loginMessage', 'Cannot find user e-mail.'));
//                 if (!user.validPassword(password))
//                     //return done(null, false);
//                     return done(null, false, req.flash('loginMessage', 'Password is not correct.'));

//                 //console.log("login Ok")
//                 return done(null, user);
//             });
//         }));

// };

var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id).exec()
            .then(user => done(null, user))
            .catch(err => done(err));
    });

    passport.use('signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    async function(req, email, password, done) {
        try {
            let user = await User.findOne({ 'email': email }).exec();
            if (user) {
                return done(null, false, req.flash('signupMessage', 'E-mail already exists.'));
            } else {
                let newUser = new User();
                newUser.name = req.body.name;
                newUser.email = email;
                newUser.password = newUser.generateHash(password);
                
                await newUser.save();
                return done(null, newUser);
            }
        } catch (err) {
            return done(err);
        }
    }));

    passport.use('login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    async function(req, email, password, done) {
        try {
            let user = await User.findOne({ 'email': email }).exec();
            if (!user) {
                return done(null, false, req.flash('loginMessage', 'Cannot find user e-mail.'));
            }
            if (!user.validPassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Password is not correct.'));
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }));
};

