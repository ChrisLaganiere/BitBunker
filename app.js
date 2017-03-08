var express = require('express'); //
var http = require('http');
var path = require('path');
var database = require('./database/db.js');
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

	if (vault && password) {
		// got vault and password
		database.openvault(vault, password, function(success) {
			if (success) {
				res.send(JSON.stringify({"success": true}));
				// TO DO: chris
			} else {
				res.send(JSON.stringify({"success": false, "reason": "Database couldn't open vault"}));
				// TO DO: chris
			}
		});
	} else {
		// missing params
		res.send(JSON.stringify({"success": false, "reason": "missing params..."}));
	}
});

// -> /createvault (POST)
//   - PARAM: vault: string name of the vault to open
//   - PARAM: password: string plaintext password
// Return:
//  {success: true} (opened vault for user session)
/// {success: false, reason: "..."} (failed to open vault)


// -> /addfile (POST)
//	 - PARAM: filename (name of the file you want to add)
//	 - PARAM: filepath (path to the file)
//   - PARAM: vault: string name of the vault to open
// Return:
//  {success: true} (if file is added)
/// {success: false, reason: "..."} (failed to add file //adding file to vault that isn't open)


// -> /getfile (POST)
//	 - PARAM: filename (name of file you want to retreive)
//   - PARAM: vault: string name of the vault to open
// Return:
//  {success: true, content: "...", filename: "..."} (if you retrieved the file)
/// {success: false, reason: "..."} (if the file isn't in the vault)


// -> /deletefile (POST)
//	 - PARAM: filename (name of file you want to delete)
//   - PARAM: vault: string name of the vault to open
// Return:
//  {success: true} (if file is deleted)
/// {success: false, reason: "..."} (if file isn't in vault)

/****/

// catch everything else and -> 404
app.use(function(req, res, next) {
  res.sendFile(path.resolve('404.html'));
});

var server = http.createServer(app);
server.listen(8000);