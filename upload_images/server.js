var formidable = require('formidable'),
	http = require('http'),
	util = require('util'),
	fs = require('fs-extra');
	
http.createServer(function(req,res){
	
if(req.url =='/upload' && req.method.toLowerCase() == 'post'){
	var form = new formidable.IncomingForm();
	
	form.parse(req, function(err, fields, files){
		res.writeHead(200, {'content-type' : 'text/plain'});
		res.write('received upload\n\n');
		res.end(util.inspect({fields : fields, files : files}));	
	});
	
	form.on('progress', function(bReceived, bExpected){
		var percent = (bReceived / bExpected) * 100;
		console.log(percent.toFixed(2));
	});

	form.on('error', function(err){
		console.error(err);
	});
	
	
	form.on('end', function(fields, files){
		var tmp_path = this.openedFiles[0].path;
		var file_name = this.openedFiles[0].name;
		
		var location = 'upload';
		fs.copy(tmp_path, location + file_name, function(err){
			if(err){
				console.err(err);
			}else{
				console.log('success\n');
			}
		});
	});
	return;
}	
	
	res.writeHead(200, {'content-type' : 'text/plain'});
	res.end(
		'<form action="/upload" enctype="multipart/form-data" method="post">'+
		'<input type="file" name="upload" multiple="multiple">'+
		'<input type="submit" value="Upload" >'+
		'</form>'
	);
	
	
	}).listen(8080);