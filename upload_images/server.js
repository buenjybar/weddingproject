var formidable = require('formidable'),
    http = require('http'),
    util = require('util'),
	fs = require('fs-extra');

var port = 8081;
var domain = 'localhost';
var imagePath = './uploads';
var emailList = 'listemail';

function getSuccessPage(){
    return [
        '<html>',
        '<head>',
        '<script>',
        'function loaded()',
        '{',
        '    window.setTimeout(CloseMe, 500);',
        '}',
        '',
        'function CloseMe() ',
        '{',
        '    window.close();',
        '}',
        '</script>',
        '</head>',
        '<body onLoad="loaded()">',
        '<h3>operation reussite</h3>',
        '</body>',
        '</html>'
    ].join('');   
    
}

http.createServer(function(req, res) {
	if (req.url == '/subscribe' && req.method.toLowerCase() == 'post') {
	    var form = new formidable.IncomingForm();
		
		form.parse(req, function(err, fields, files) {
            if(fields.email == null || fields.email.length < 1) return;
			var data = fields.email + ", ";
			fs.appendFile(emailList ,data, function(err){
				if(err){
					console.log(err);
				}
				else {
					res.writeHead(200, {'content-type': 'text/html'});
					res.end(getSuccessPage());
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
        res.end(getSuccessPage());
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
				console.log('image added: ', file_name);
			}
		});
		}
	});
	
    return;
  }
}).listen(port);
console.log("server started port "+port)
