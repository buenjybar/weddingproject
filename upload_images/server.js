var formidable = require('formidable'),
    http = require('http'),
    util = require('util'),
	fs = require('fs-extra');

http.createServer(function(req, res) {
	if (req.url == '/subscribe' && req.method.toLowerCase() == 'post') {
		
	}
	
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    // parse a file upload
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'text/html'});
	  res.end(
		  '<meta http-equiv="refresh" content="0; url=http://localhost:8080/" />'
	  );
    });

	form.on('end', function(fields, files){
		var i = 0, length = this.openedFiles.length;
		
		for(; i < length; ++i){
		var tmp_path = this.openedFiles[i].path;
		var file_name = this.openedFiles[i].name;
		
		var location = './uploads/';
		file_name = file_name.replace(/\s/g, '_');
		fs.copy(tmp_path, location + file_name, function(err){
			if(err){
				console.log(err);
			}else{
				console.log('success');
			}
		});
		}
	});
	
    return;
  }

  // show a file upload form
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(
	'Veuillez selection les images a transferer '+
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="file" name="upload" multiple="multiple" accept="image/x-png image/gif image/jpeg"><br>'+
    '<input type="submit" value="Transferer">'+
    '</form>'
  );
}).listen(8080);
console.log("server started port 8080")