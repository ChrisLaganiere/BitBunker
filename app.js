var express = require('express');
var http = require('http');
var path = require('path');
var database = require('./database/db.js')
var router = express.Router();
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// var api = require('./routes/api');
// app.use('/api', api);

app.use('/testroute', function(req, res) {

	var a = [
		'file1',
		'file2',
		'file3'
	];

	res.send(JSON.stringify(a));
});


/*** Routes ***/

// -> /openvault (POST)
//   - PARAM: vault: string name of the vault to open
//   - PARAM: password: string plaintext password
// Return:
//  {success: true} (opened vault for user session)
/// {success: false, reason: "..."} (failed to open vault)
app.post('/openvault', function(req, res) {
	console.log(req.body);
	var vault = req.body['vault'];
	var password = req.body['password'];
	console.log("user tried to open", vault);
	db.openVault(vault, password, function(success) {
			if (success) {

				res.send("not implemented yet");
			}
			else {
			// missing params
			res.send(JSON.stringify({"success": false,
				"reason": "missing params..."}));
			}
		}); 
	});

app.use('/get/:filename', function(req, res, next) {
	console.log(req.params['filename']);
	res.sendFile(path.resolve(req.params['filename']));
    // res.status(400).send(); // or return error
    if (userHasAccess) {
    	db.filesForVault('somevault', function(files) {
    		res.json(files);
    	});
    }
});

/****/

// catch everything else and -> 404
app.use(function(req, res, next) {
  res.sendFile(path.resolve('404.html'));
});

var server = http.createServer(app);
server.listen(8000);

module.exports = router;