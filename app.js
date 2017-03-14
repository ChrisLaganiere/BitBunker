var express = require('express');
var http = require('http');
var path = require('path');
var app = express();

var bodyParser = require('body-parser');

var database = require('./database/db.js');
var secure = require('./secure.js');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


/*** Routes ***/

// -> /openvault (POST)
//   - PARAM: vault: string name of the vault to open
//   - PARAM: password: string plaintext password
// Return:
//  {success: true} (opened vault for user session)
/// {success: false, reason: "..."} (failed to open vault)
app.post('/openvault', function(req, res) {
	res.send(JSON.stringify({"success": true}));
});

app.post('/createvault', function(req, res) {
	res.send(JSON.stringify({"success": true}));
});

app.post('/addfile', function(req, res) {
	res.send(JSON.stringify({"success": true}));
});

app.post('/getfile', function(req, res) {
	res.send(JSON.stringify({"success": true}));
});

app.post('/deletefile', function(req, res) {
	res.send(JSON.stringify({"success": true}));
});


app.post('/action', function(req, res) {
	console.log(req.body);
	// TODO: implement action
	res.json({"success": true});

	var action = "";
	var params = {};

	var bunkerData = req.body['bunker'];
	if (bunkerData) {
		var aeskey = "passwordpasswordpasswordpassword"
		var iv = "drowssapdrowssap"
		var decrypted = secure.decrypt(aeskey, iv, bunkerData);
		console.log(decrypted);
		if (decrypted) {
			var pattern = /([^;=]*)=([^;=]*);/g;
			var match = pattern.exec(decrypted);
			// console.log(matches.length);
			while (match != null) {
				console.log(match[1], ":", match[2]);
				if (match[1] === "action") {
					// 'action' param
					action = match[2];
				} else {
					// some other parameter
					params[match[1]] = match[2];
				}
				// loop to next match
				match = pattern.exec(decrypted);
			}
		}
	}

	console.log('executing', action, params);
});

/****/

// catch everything else and -> 404
app.use(function(req, res, next) {
	console.log("404");
  res.sendFile(path.resolve('404.html'));
});

var server = http.createServer(app);
server.listen(8000);
