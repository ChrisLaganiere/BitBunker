// api.js
// handles routes on /api/...

var express = require('express');
var router = express.Router();

var db = require('../database/db.js');

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

// ...
// more routes

module.exports = router;
