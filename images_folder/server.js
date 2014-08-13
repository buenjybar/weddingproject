var express = require("express"),
    app = express(),
    qt = require('quickthumb'),
    crypto = require('crypto'),
    formidable = require('formidable'),
    util = require('util'),
    fs = require('fs-extra'),
    gallery = require('node-gallery'),
    ejs = require('ejs');

app.use(qt.static(__dirname + '/'));
//app.use(express.bodyParser()); NOT RECOMMENDED ANYMORE
app.use(express.bodyParser());
//app.use(express.cookieParser());
app.use(express.session({secret: 'JeanGabSession'}));
app.use(gallery.middleware({static: 'resources', directory: '/uploads', rootURL: "/gallery"}));
app.set('view engine', 'ejs');

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

//authentification
app.post('/login', function (req, res) {    
    var post = req.body;
    
    if (post == null){
        console.log('DEBUG: empty body');
        res.send('invalid request');
        return;
    }
    if (post.password === TestPasswd || post.password === Passwd ) {
        console.log('DEBUG: logged');
        req.session.user_id = 123;
        //res.redirect('/form');
        res.json({ok:true});//res.semd(200);
    } else {
        console.log('DEBUG: bad password');
        res.send('Mot de passe invalid');
    }
});

// Show the upload form
app.get('/form', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html' });

    var form = [
        '<div class="row panel">',
        '<div class="large-12 medium-12 small-12 columns">',
        '<form action="http://localhost:8090/upload" enctype="multipart/form-data" method="post">',
        '<div class="row">',
        '<div class="large-6 columns">',
        '<div class="row collapse">',
        '<div class="small-10 columns">',
        '<input multiple="multiple" name="upload" type="file"accept="image/x-png image/gif image/jpeg"/>',
        '</div>',
        '<div class="small-2 columns">',
        '<input type="submit" class="button postfix" value="Transferer"/>',
        '</div>',
        '</div>',
        '</div>',
        '</div>',
        '</form>',
        '</div>',
        '</div>'
    ].join('');
    res.end(form);
});

app.post('/upload', function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        res.writeHead(200, {'content-type': 'text/plain'});
//        res.write('Image Uploaded');
//        res.end(util.inspect({fields: fields, files: files}));
        res.end();
    });

    form.on('end', function (fields, files) {
        var temp_path = this.openedFiles[0].path;
        var file_name = this.openedFiles[0].name;
        var new_location = 'uploads/';
        file_name = file_name.replace(/\s/g, '_');
        fs.copy(temp_path, new_location + file_name, function (err) {
            if (err) {
                console.error(err);
            } else {
                console.log("Image Uploaded : ", file_name);
            }
        });
    });
});

app.get('/gallery*', function (req, res) {
    var data = req.gallery;
    data.layout = false;
    res.render(data.type + '.ejs', data);
});

var port = 8090;
app.listen(port);
console.log('listen on port ', port);