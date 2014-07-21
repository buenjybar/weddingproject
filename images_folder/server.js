var express = require('express'),
    photos = require('./routes/photos');

var app = express();

app.configure(function(){
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
});

//<=============================== GET
app.get('/photos', photos.findAll);
app.get('/photos/:id', photos.findById);

//<=============================== POST
app.post('/photos', photos.addPhoto);

//<=============================== PUT
//app.put
//<=============================== DELETE
//app.delete

app.listen(3000);
console.log('listen on port 3000');

