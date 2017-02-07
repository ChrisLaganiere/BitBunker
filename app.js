var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

app.use('/api/get/:filename', function(req, res, next) {
	console.log(req.params['filename']);
	res.sendFile(path.resolve(req.params['filename']));
});

// catch 404 and forward to frontpage
app.use(function(req, res, next) {
  res.sendFile(path.resolve('404.html'));
});

var server = http.createServer(app);
server.listen(8000);
