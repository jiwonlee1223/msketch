var User = require('../models/user');

module.exports = function(app, passport, fs) {

    // Login
    app.get('/', isLoggedIn, function(req, res){
        console.log(req.user)
        res.render('index', {user: req.user})
    });

    app.get('/login', function(req, res){
        res.render('login', {message: req.flash('loginMessage')})
    });

    app.get('/signup', function(req, res){
        res.render('signup', {message: req.flash('signupMessage')})
    });

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    app.get('/manual', isLoggedIn, function(req, res){
        res.render('manual', {user: req.user})
    });

    app.post('/signup', passport.authenticate('signup', {
        successRedirect : '/login',
        failureRedirect : '/signup', //가입 실패시 redirect할 url주소
        failureFlash : false
    }));
    app.post('/login', passport.authenticate('login', {
            //successRedirect : '/profile',
            //failureRedirect : '/', //로그인 실패시 redirect할 url주소
            //failureFlash : false
            failureRedirect : '/'
        }),
        function(req, res){
            res.redirect('/')
        }
    );

    // Setting IO
    app.post('/saveSettings', function(req, res){
        var dir = './settings/';

        fs.writeFile( dir + '/'+req.user.id+'.json', req.body["settings"], function(err) {
            if(err) {
                return console.log(err);
            }
            res.sendStatus(200);
        });
    });
    app.post('/loadSettings', function(req, res){
        var dir = './settings/';
        var fileName = req.user.id + '.json';
        if (!fs.existsSync(dir+fileName)){
            fileName = "default.json";
        }
        fs.readFile(dir+"/"+fileName, 'utf8', function(err, data){
            if(err) {
                return console.log(err);
            }
            res.send({settings: data});
        });
    });

    // File IO
    app.post('/save', function(req, res){
        var dir = './storage/'+req.user.id;
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        fs.writeFile( dir + '/'+req.body["fileName"]+'.json', req.body["file"], function(err) {
            if(err) {
                return console.log(err);
            }
            res.sendStatus(200);
        });
    });
    app.post('/loadFile', function(req, res){
        var dir = './storage/'+req.user.id;
        fs.readdir(dir, function(err, files) {
            if(err) {
                return console.log(err);
            }
            var fileList = [];
            files.forEach(function(f) {
                fileList.push(f);
            });
            res.send({list: fileList});
        });
    });

    app.post('/openFile', function(req, res){
        var dir = './storage/'+req.user.id;
        var fileName = req.body["fileName"];
        fs.readFile(dir+"/"+fileName, 'utf8', function(err, data){
            if(err) {
                return console.log(err);
            }
            res.send({file: data, name: fileName});
        });
    });

    app.post('/uploadFile', function(req, res){
    });

    app.post('/renameFile', function(req, res){
    });

    app.post('/deleteFile', function(req, res){
        var dir = './storage/'+req.user.id;
        var fileName = req.body["fileName"];
        fs.unlink(dir+"/"+fileName, function(err, data){
            if(err) {
                return console.log(err);
            }
            fs.readdir(dir, function(err, files) {
                if(err) {
                    return console.log(err);
                }
                var fileList = [];
                files.forEach(function(f) {
                    fileList.push(f);
                });
                res.send({list: fileList});
            });
        });
    });
    /*
    app.get('/find', function(req,res){
        User.find(function(err, books){
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(books);
        })
    });
    */

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()){
            return next();
        } else {
            res.redirect('/login');
        }
    }
}
