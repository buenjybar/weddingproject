var formidable = require('formidable'),
    http = require('http'),
    util = require('util'),
	fs = require('fs-extra');

var port = 8081;
var imagePath = './uploads';
var emailList = 'listemail';

http.createServer(function(req, res) {
	if (req.url == '/subscribe' && req.method.toLowerCase() == 'post') {
	    var form = new formidable.IncomingForm();
		
		form.parse(req, function(err, fields, files) {
            console.log(fields.email,' ', fields)
            if(fields.email == null || fields.email.length < 1) return;
			var data = fields.email + ", ";
			fs.appendFile(emailList ,data, function(err){
				if(err){
					console.log(err);
				}
				else {
					res.writeHead(200, {'content-type': 'text/html'});
					res.end()
                    //res.end(refreshRedirection);
				  }
			})
		  });
        return;
	}

  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    // parse a file upload
    var form = new formidable.IncomingForm();
      
    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {'content-type': 'text/html'});
        res.end()
        //res.redirect("back");
	  //res.end(refreshRedirection);
    });

	form.on('end', function(fields, files){
		var i = 0, length = this.openedFiles.length;
		for(; i < length; ++i){
		var tmp_path = this.openedFiles[i].path;
		var file_name = this.openedFiles[i].name;
		
		file_name = file_name.replace(/\s/g, '_');
		fs.copy(tmp_path, imagePath + '/' + file_name, function(err){
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
    '<form action="/upload" enctype="multipart/form-data" method="post" target="_blank">'+
    '<input type="file" name="upload" multiple="multiple" accept="image/x-png image/gif image/jpeg"><br>'+
    '<input type="submit" value="Transferer">'+
    '</form>'+
	'Si vous souhaitez recevoir les nouvelles photos par email, veuillez entrer votre adresse email.'+
	'<form action="/subscribe" enctype="multipart/form-data" method="post">'+
	'<input type="email" name="email"><br>'+
	'<input type="submit" value="Souscrire">'+
	'</form>'
  );
}).listen(port);
console.log("server started port "+port)
