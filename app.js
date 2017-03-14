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
//   - PARAM: secret: string plaintext secret
// Return:
//  {success: true} (opened vault for user session)
/// {success: false, reason: "..."} (failed to open vault)
var openvault = function(params, req, res) {
	var vault = params['vault'];
	var secret = params['secret'];
	console.log("user tried to open", vault);

	if (vault && secret) {
		// got vault and secret
		database.openvault(vault, secret, function(success) {
			if (success) {
				res.json({"success": true});
				// TO DO: chris
			} else {
				res.json({"success": false, "reason": "Database couldn't open vault"});
				// TO DO: chris
			}
		});
	} else {
		// missing params
		res.json({"success": false, "reason": "missing params..."});
	}
};

// -> /createvault (POST)
//   - PARAM: vault: string name of the vault to open
//   - PARAM: secret: string plaintext secret
// Return:
//  {success: true} (opened vault for user session)
/// {success: false, reason: "..."} (failed to open vault)
var createvault = function(params, req, res) {
	var vault = params['vault'];
	var secret = params['secret'];
	console.log("user tried to create", vault);

	if (vault && secret) {
		// got vault and secret
		database.createvault(vault, secret, function(success) {
			if (success) {
				res.json({"success": true});
				// TO DO: chris
			} else {
				res.json({"success": false, "reason": "Database couldn't create vault"});
				// TO DO: chris
			}
		});
	} else {
		// missing params
		res.json({"success": false, "reason": "missing params..."});
	}
};

// -> /addfile (POST)
//	 - PARAM: filename (name of the file you want to add)
//	 - PARAM: filepath (path to the file)
//   - PARAM: vault: string name of the vault to open
// Return:
//  {success: true} (if file is added)
/// {success: false, reason: "..."} (failed to add file //adding file to vault that isn't open)
var addfile = function(params, req, res) {
	var vault = params['vault'];
	var filename = params['filename'];
	// var content = params['content'];
	// var filepath = req.body['filepath'];
	var filepath = 'ayyy.txt';
	console.log("user tried to add", filename);

	if (vault && filename && filepath) {
		// got params
		database.addfile(vault, filename, filepath, function(success) {
			if (success) {
				res.json({"success": true});
				// TO DO: chris
			} else {
				res.json({"success": false, "reason": "Database couldn't add file because file path is incorrect or vault isn't open"});
				// TO DO: chris
			}
		});
	} else {
		// missing params
		res.json({"success": false, "reason": "missing params..."});
	}
};

// -> /getfile (POST)
//	 - PARAM: filename (name of file you want to retreive)
//   - PARAM: vault: string name of the vault to open
// Return:
//  {success: true, content: "...", filename: "..."} (if you retrieved the file)
/// {success: false, reason: "..."} (if the file isn't in the vault)
var getfile = function(params, req, res) {
	var vault = params['vault'];
	var filename = params['filename'];
	console.log("user tried to get", filename);

	if (vault && filename) {
		// got params
		database.getfile(vault, filename, function(success) {
			if (success) {
				res.json({"success": true, "filename": filename + " was successfully retrieved"});
				// TO DO: chris
			} else {
				res.json({"success": false, "reason": "Database couldn't get file because file isn't in vault"});
				// TO DO: chris
			}
		});
	} else {
		// missing params
		res.json({"success": false, "reason": "missing params..."});
	}
};

// -> /deletefile (POST)
//	 - PARAM: filename (name of file you want to delete)
//   - PARAM: vault: string name of the vault to open
// Return:
//  {success: true} (if file is deleted)
/// {success: false, reason: "..."} (if file isn't in vault)
var deletefile = function(params, req, res) {
	var vault = params['vault'];
	var filename = params['filename'];
	console.log("user tried to delete", filename);

	if (vault && filename) {
		// got params
		database.getfile(vault, filename, function(success) {
			if (success) {
				res.json({"success": true});
				// TO DO: chris
			} else {
				res.json({"success": false, "reason": "Database couldn't delete file because file isn't in vault"});
				// TO DO: chris
			}
		});
	} else {
		// missing params
		res.json({"success": false, "reason": "missing params..."});
	}
};


/*****/

// actual route, with encrypted body payload
app.post('/action', function(req, res) {
	var bunkerData = req.body['bunker'];
	console.log("received data: ", bunkerData);

	var action = "";
	var params = {};

	console.log("decrypting data...");
	if (bunkerData) {
		var aeskey = "passwordpasswordpasswordpassword"
		var iv = "drowssapdrowssap"
		var decrypted = secure.decrypt(aeskey, iv, bunkerData);
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

	console.log('finished.');
	console.log('executing', action, params);
	switch(action) {
		case "openvault":
			openvault(params, req, res);
			break;
		case "createvault":
			createvault(params, req, res);
			break;
		case "addfile":
			addfile(params, req, res);
			break;
		case "getfile":
			getfile(params, req, res);
			break;
		case "deletefile":
			deletefile(params, req, res);
			break;
		default:
			console.log("unknown action, ignoring");
			res.json({"success": false, "reason": "unknown action: " + action});
			break;
	}
});

/****/

// catch everything else and -> 404
app.use(function(req, res, next) {
	console.log("404");
  res.sendFile(path.resolve('404.html'));
});

var server = http.createServer(app);
server.listen(8000);
