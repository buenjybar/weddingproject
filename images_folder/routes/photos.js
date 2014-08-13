var debug = true;

var formidable = require('formidable'),
    util = require('util'),
    fs = require('fs-extra');


exports.findAll = function (req, res) {

};


exports.findByName = function (req, res) {

};


exports.addPhoto = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('Image Uploaded');
        res.end(util.inspect({fields: fields, files: files}));
    });

    form.on('end', function(fields, files) {
        var temp_path = this.openedFiles[0].path;
        var file_name = this.openedFiles[0].name;
        var new_location = 'uploads/';
        file_name = file_name.replace(' ','_');
        fs.copy(temp_path, new_location + file_name, function(err) {
            if (err) {
                console.error(err);
            } else {
                console.log("Image Uploaded : ", file_name);
            }
        });
    });
};