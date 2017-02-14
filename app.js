var express = require('express');
var http = require('http');
var path = require('path');
var app = express();

var api = require('./routes/api');
app.use('/api', api);

// catch everything else and -> 404
app.use(function(req, res, next) {
  res.sendFile(path.resolve('404.html'));
});

var server = http.createServer(app);
server.listen(8000);
