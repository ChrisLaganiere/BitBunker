// app.js
// nodejs server app for 'BitBunker'
// UCLA CS M117 Group :cash::cash::cash:


// Packages
var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var app = express();

// Local files
var database = require('./database/db.js');
var secure = require('./secure.js');

// express addon - sessions
app.use(session({
  key: "bitbunker",
  secret: "fbeb4463e5d14fe8f6d0463ff78077c76c73d1b3",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 2678400000, // 31 days
    httpOnly: false
  },
}));

// express addon - post variables
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


/*** Routes ***/

// -> /createvault (POST)
//   - PARAM: vault: string name of the vault to open
//   - PARAM: secret: string plaintext secret
// Return:
//  {success: true} (opened vault for user session)
//  {success: false, reason: "..."} (failed to open vault)
var createvault = function(params, req, res) {
	var vault = params['vault'];
	var secret = params['secret'];

	if (vault && secret) {
		// got vault and secret
		database.createvault(vault, secret, function(success) {
			if (success) {
				res.json({"success": true});
				// open vault for this session
				var vaults = req.session.vaults || [];
				vaults.push(vault);
				req.session.vaults = vaults;
				req.session.save();
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

// -> /openvault (POST)
//   - PARAM: vault: string name of the vault to open
//   - PARAM: secret: string plaintext secret
// Return:
//  {success: true} (opened vault for user session)
//  {success: false, reason: "..."} (failed to open vault)
var openvault = function(params, req, res) {
	var vault = params['vault'];
	var secret = params['secret'];

	if (vault && req.session.vaults && req.session.vaults.includes(vault)) {
		res.json({"success": true});
	}
	else if (vault && secret) {
		// got vault and secret
		database.openvault(vault, secret, function(success) {
			if (success) {
				res.json({"success": true});
				// open vault for this session
				var vaults = req.session.vaults || [];
				vaults.push(vault);
				req.session.vaults = vaults;
				req.session.save();
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

// -> /listvault (POST)
//   - PARAM: vault: string name of the vault to open
// Return:
//  {success: true, files: [...]} (opened vault for user session)
//  {success: false, reason: "..."} (failed to open vault)
var listvault = function(params, req, res) {
	var vault = params['vault'];
	if (vault && req.session.vaults && req.session.vaults.includes(vault)) {
		// vault is open, list contents
		database.listvault(vault, function(success, results) {
			if (success) {
				res.json({"success": true, "files": results});
			} else {
				res.json({"success": false, "reason": "Database couldn't retrieve vault contents"});
			}
		});
	} else {
		// missing params
		res.json({"success": false, "reason": "missing params..."});
	}
};

// -> /closevault (POST)
//   - PARAM: vault: string name of the vault to close
// Return:
//  {success: true} (closed vault for user session)
//  {success: false, reason: "..."} (failed to close vault)
var closevault = function(params, req, res) {
	var vault = params['vault'];

	if (vault && req.session.vaults && req.session.vaults.includes(vault)) {
		var vaults = req.session.vaults;
		for(var i = vaults.length - 1; i >= 0; i--) {
		    if(vaults[i] === vault) {
		       vaults.splice(i, 1);
		    }
		}
		res.json({"success": true});
		req.session.vaults = vaults;
		req.session.save();
	}
	else {
		// not open, don't need to close
		res.json({"success": false, "reason": "vault not open"});
	}
};

// -> /addfile (POST)
//	 - PARAM: filename (name of the file you want to add)
//	 - PARAM: content: string
//   - PARAM: vault: string name of the vault to open
// Return:
//  {success: true} (if file is added)
//  {success: false, reason: "..."} (failed to add file //adding file to vault that isn't open)
var replacefile = function(params, req, res) {
	var vault = params['vault'];
	var filename = params['filename'];
	var content = params['content'];

	if (vault && filename && req.session.vaults && req.session.vaults.includes(vault)) {
		// got params
		database.replacefile(filename, vault, content, function(success) {
			if (success) {
				res.json({"success": true});
				// TO DO: chris
			} else {
				res.json({"success": false, "reason": "Database couldn't replace file"});
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
//  {success: false, reason: "..."} (if the file isn't in the vault)
var getfile = function(params, req, res) {
	var vault = params['vault'];
	var filename = params['filename'];

	if (vault && filename && req.session.vaults && req.session.vaults.includes(vault)) {
		// got params
		database.getfile(filename, vault, function(success, result) {
			if (success && result) {
				res.json({"success": true, "filename": filename, "content": result.content});
				// TO DO: chris
			} else {
				res.json({"success": false, "reason": "Couldn't get file"});
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
//  {success: false, reason: "..."} (if file isn't in vault)
var deletefile = function(params, req, res) {
	var vault = params['vault'];
	var filename = params['filename'];

	if (vault && filename) {
		// got params
		database.deletefile(filename, vault, function(success) {
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


// actual express route, with encrypted body payload
app.post('/action', function(req, res) {
	console.log("\nPOST /action\n  ", req.body);
	var bunkerData = req.body['bunker'];

	var action = "";
	var params = {};

	console.log("decrypting data...");
	if (bunkerData) {
		var aeskey = "passwordpasswordpasswordpassword"
		var iv = "drowssapdrowssap"
		var decrypted = secure.decrypt(aeskey, iv, bunkerData);
		if (decrypted) {
			// NOTE: REMOVE BEFORE PROD
			console.log('decrypted:', '"' + decrypted + '"');

			var pattern = /([^;=]*)=([^;=]*);/g;
			var match = pattern.exec(decrypted);
			// console.log(matches.length);
			while (match != null) {
				// console.log(match[1], ":", match[2]);
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

	// NOTE: REMOVE BEFORE PROD
	console.log('executing', action, params);
	switch(action) {
		case "createvault":
			createvault(params, req, res);
			break;
		case "openvault":
			openvault(params, req, res);
			break;
		case "closevault":
			closevault(params, req, res);
			break;
		case "listvault":
			listvault(params, req, res);
			break;
		case "replacefile":
			replacefile(params, req, res);
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
