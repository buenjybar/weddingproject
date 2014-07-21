var mongoose = require('mongoose');

//Mongoose dependencies
var Schema = mongoose.Schema;

//example schema
var schema = new Schema({
    name: String,
    date: Date,
    img: { data: Buffer, contentType: String}
});

//model
mongoose.model('ImageDataModel', schema);