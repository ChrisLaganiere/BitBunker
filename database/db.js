// db.js
// connects to and handles database + crypto

var mysql = require("mysql");
var secrets = require('../secrets.json');
var crypto = require('../crypto.js');

var db = {};

//create vault
db.createvault = function(vault, secret, callback) {
  var sel = 'SELECT * FROM Vaults WHERE vault_name = ?';
  var params = [vault];
    
  db.performQuery(sel, params, function (success, results) {
    if (success && results.length > 0) {
      // vault exists
      callback(false);
    } else {
      // create new vault
      crypto.hash_string(secret, function(err, hash) {
        var insert = 'INSERT INTO Vaults (vault_name, vault_secret) VALUES (?, ?)';
        var params = [vault, hash];
        console.log(params);

        db.performQuery(insert, params, function (success, results) {
          var event = success ? 'Vault created.' : 'Error creating vault';
          console.log(event);
          callback(success);
        });
      });
    }
  });
};

//opens vault 
db.openvault = function(vault, secret, callback) {
  var sel = 'SELECT * FROM Vaults WHERE vault_name = ?';
  var params = [vault];
    
  db.performQuery(sel, params, function (success, results) {
    if (success && results.length > 0) {
      // compare hashes with vault
      crypto.compare_string(secret, results[0].vault_secret, function (success) {
        var event = success ? 'Vault opened.' : 'Error opening vault';
        console.log(event);
        callback(success);
      });
    }
    else {
      // no such vault
      console.log('Error opening vault');
      callback(false);
    }
  });
};

//add / update file in vault
db.replacefile = function(filename, vault, content, callback) {
  var insert = 'REPLACE INTO Files (filename, content, vault_name) VALUES (?, ?, ?)';
  var params = [filename, content, vault];
  
  db.performQuery(insert, params, function (success, results) {
    // console.log(results);
    if (success && results.affectedRows > 0) {
      console.log('File added.');
      callback(true);
    }
    else {
      console.log('Error replacing file');
      callback(false);
    }
  });
};

//get file vault
db.getfile = function(filename, vault, callback) {
  var sel = 'SELECT * FROM Files WHERE filename = ? AND vault_name = ?';
  var params = [filename, vault];
  
  db.performQuery(sel, params, function (success, results) {
    // console.log(results);
    if (success && results.length > 0) {
      console.log('Got file');
      callback(true, results[0]);
    }
    else {
      console.log('Error getting file');
      callback(false, null);
    }
  });
};

//delete file from vault
db.deletefile = function(filename, vault, callback){
  var del = 'DELETE FROM Files WHERE filename = ? AND vault_name = ?';
  var params = [filename, vault];
  
  db.performQuery(del, params, function (success, results) {
    if (success) {
      console.log('File deleted');
    }
    else {
      console.log('Error deleting file');
    }
    callback(success);
  });
};

// callback: (success: bool, results: ...)
db.performQuery = function(query, params, callback) {
  var con = mysql.createConnection({
    host: "localhost",
    user: secrets.dbusername,
    password: secrets.dbpassword,
    database: 'BitBunker'
  });

  con.connect(function(err) {
    if (err) {
      console.log('Error connecting to Db');
      return;
    }
    // console.log('Connection established');
  });

  con.query(query, params, function(err, results) {
      if (err) {
        console.log('mysql error:', err);
        callback(false, null);
      }
      else {
        callback(true, results);
      }
  });

  con.end(function(err) {
    // The connection is terminated gracefully
    // Ensures all previously enqueued queries are still
    // before sending a COM_QUIT packet to the MySQL server.
  });
};

module.exports = db;
