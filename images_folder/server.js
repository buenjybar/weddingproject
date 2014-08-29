var express = require("express"),
    app = express(),
    qt = require('quickthumb'),
    crypto = require('crypto'),
    formidable = require('formidable'),
    util = require('util'),
    fs = require('fs-extra'),
    cors = require('cors');


var port = 8082, port2 = 8081;
var picturedir = '/uploads';
var symbolicpath = '../images/uploads';
var domain = '54.201.238.28';

app.use(qt.static(__dirname + '/'));
app.use(express.bodyParser());
app.use(express.session({secret: 'JeanGabSession'}));

app.set(cors());

var m1 = crypto.createHash('md5');
m1.update('test');
var TestPasswd = m1.digest('hex');

var m2 = crypto.createHash('md5');
m2.update('23082014');
var Passwd = m2.digest('hex');

function checkAuth(req, res, next) {
    if (!req.session.user_id) {
        res.send('Veillez vous authentifier pour voir cette page');
    } else {
        next();
    }
}

function prepareRespond(res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
}

function getUploadHTML(){
 return [
    '<div class="row panel">',
    '<div class="row hide" id="success-msg">',
    '<div data-alert class="alert-box alert ">',
    '<span>Success, image(s) transferes </span>',
    '<a href="#" class="close">&times;</a>',
    '</div>',
    '</div>',
    '<h3>Veuillez selection les images a transferer</h3>',
    '<form id="postImage" action="http://',domain,':', port2,'/upload" enctype="multipart/form-data" method="post" target="_blank">',
    '<div class="large-12 medium-12 small-12 columns">',
    '<input type="file" name="upload" multiple="multiple" accept="image/*"><br>',
    '</div>',
    '<div class="large-centered large-2 medium-centered medium-2 small-centered small-6 columns">',
    '<button type="submit" class="button postfix" onclick="postForm();">Transferer</button>',
    '</div>',
    '</form>',
    '</div>'
    ].join("");
}

function getEmailHTML(){
    return [
        '<div class="row panel">',
        '<h3>Recevoir les nouvelles photos par email</h3>',
	   '<form id="postEmail" action="http://',domain,':', port2,'/subscribe" method="post" target="_blank">',
        '<div class="row collapse">',
        '<div class="small-12 medium-2 large-2 columns">',
        '<span class="prefix">email:</span>',
        '</div>',
        '<div class="large-10 medium-10 small-12 columns">',
        '<input type="email" name="email"><br>',
        '</div>',
        '</div>',
        '<div class="large-centered large-2 medium-centered medium-2 small-centered small-6 columns">',
        '<button type="submit" class="button postfix" onclick="postEmail();">Souscrire</button>',
        '</div>',
	   '</form>'        
    ].join("");
}

function getUploadRespond(){
    return [
	   getUploadHTML(),
       getEmailHTML()
    ].join('');
}    

function walk (dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
}
    
//authentification
app.post('/login', function (req, res) {    
    var post = req.body;
    prepareRespond(res);
    
    if (post == null){
        console.log('error login, empty body');
        res.send('invalid request');
        return;
    }
    if (post.password === TestPasswd || post.password === Passwd ) {
        console.log('success in login');
        req.session.user_id = 123;
        var form = getUploadRespond();
        
        res.statusCode = 200;
        res.header('content-type', 'text/html');
        res.send(form);
    } else {
        console.log('DEBUG: bad password');
        
        res.statusCode = 400;
        res.header('content-type', 'text/plain');
        res.send('Mot de passe invalid');
    }
});

app.post('/gallery', function (req, res) {
    prepareRespond(res);
    
    walk(picturedir, function(err, list){
        if(list == null) { res.send([]); return};
        var results= list.filter(function(file){
            return file.match(/(\.JPG|\.jpg|\.png|\.bmp)$/)
            })
            .map(function(file){
                return file.replace( picturedir, symbolicpath);
            });
        res.send(results);
    });
});

app.listen(port);
console.log('listen on port ', port);
