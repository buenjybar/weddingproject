var debug = true;

//Mongo dependencies
var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;


//Mongoose dependencies
var mongoose = require('mongoose');
require('../model/images'); //import model
var ImageData = mongoose.model('ImageDataModel');


//instantiate the communication to the server
var server = new Server('localhost', 27017, {auto_reconnect: true});
//instantiate the database
db = new Db('photosdb', server);
/*
db.open(function (err, db) {
    if (err) return console.dir(err);

    if (debug) console.log("Connected to 'photodb' database");

    */
/*grid.put(buffer, {metadata: {category: 'text'}, content_type: 'text'}, function (err, fileInfo) {
     grid.get(fileInfo._id, function (err, data) {
     if (debug) console.log('Retrieved data: ' + data.toString());
     grid.delete(fileInfo._id, function () {
     });
     });
     });*//*



    */
/*db.collection('photos', {strict: true}, function (err, collection) {
     if (err) {
     if (debug) console.log("The 'photos' collection doesn't exist. Creating it with sample data...");
     clearDB();
     }
     });*//*

});
*/

mongoose.connect('localhost', db);
mongoose.connection.on('open', function () {
    if (debug) console.log('Mongoose connection Open');

//    var a = new ImageData;
//    a.img.data = fs.readFileSync(imgPath);
//    a.img.contentType = 'image/png';
//    a.save(function (err, a) {
//        if(err) console.dir(err);
//
//        if (debug) console.log('image Saved: ' + a);
//    });
});

exports.findAll = function (req, res) {

    ImageData.find({}, function (err, items) {
        var ids = items.map(function (el) {
            return el['_id'];
        });
        res.send(ids);
    });


    /*db.collection('photos', function (err, collection) {
     collection.find().toArray(function (err, items) {
     res.send(items);
     });
     });*/
};


exports.findById = function (req, res) {
    var id = req.params.id;
    if (debug) console.log('Retrieving photo: ' + id);
    //request element and send it to the client

    ImageData.findOne({'_id': new BSON.ObjectID(id)}, function (err, item) {
        res.send(item['img']);
    });


    /*
     db.collection('photos', function (err, collection) {
     collection.findOne({'_id': new BSON.ObjectID(id)}, function (err, item) {
     res.send(item);
     });
     });*/
};


exports.addPhoto = function (req, res) {
    var photo = req.body;
    if (debug) console.log('Adding Photo: ' + JSON.stringify(photo));

    var newImage = new ImageData;

    newImage.name = photo.name;
    newImage.img.data = photo.data;
    newImage.date = new Date();
    newImage.img.contentType = photo.contentType;
    newImage.save(function (err, img) {
        if (err) {
            console.dir(err);
            res.send(500, {error: 'Cannot save the image'});
        }

        if (debug) console.log('image Saved: ' + img._id);
        //send request ok
        res.send(200);
    });
};


function populateDB() {
    var test = [
        {name: 'photo 1'},
        {name: 'photo 2'},
        {name: 'photo 3'}
    ];

    db.collection('testDb', function (err, collection) {
        collection.insert(test, {safe: true}, function (err, result) {
        });
    });
}


function clearDB() {
    db.collection('testDb', function (err, collection) {
        collection.remove({});
    });
}

