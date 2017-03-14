// db.js
// connects to and handles database

var mysql = require("mysql");
var secrets = require('../secrets.json');

var db = {};

//create vault
db.createvault = function(vault, secret, callback) {
  var insert = 'INSERT INTO Vaults (vault_name, vault_secret) VALUES (?, ?)';
  var params = [vault, secret];

  db.performQuery(insert, params, function (success, results) {
    if (success) {
      console.log('Vault created!');
    }
    else {
      console.log('Error creating vault');
    }
    callback(success);
  });
};

//opens vault 
db.openvault = function(vault, secret, callback) {
  var sel = 'SELECT * FROM Vaults WHERE vault_name = ? AND vault_secret = ?';
  var params = [vault, secret];
  
  db.performQuery(sel, params, function (success, results) {
    if (success) {
      console.log('Vault opened.');
    }
    else {
      console.log('Error opening vault');
    }
    callback(success);
  });
};

//add file to vault
db.addfile = function(name, path, vault, callback){
  var insert = 'INSERT INTO Files (file_name, file_path, vault_name) VALUES (?, ?, ?)';
  var params = [name, path, vault];
  
  db.performQuery(insert, params, function (success, results) {
    if (success) {
      console.log('File added.');
    }
    else {
      console.log('Error adding file');
    }
    callback(success);
  });
};

//delete file from vault
db.deletefile = function(name, vault, callback){
  var del = 'DELETE FROM Files WHERE file_name = ? AND vault_name = ?';
  var params = [name, vault];
  
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

//get file vault
db.getfile = function(file_name, vault, callback) {
  var exec = 'SELECT * FROM Table WHERE file_name = ? vault_name = ?';
  var params = [file_name, vault];
  
  db.performQuery(del, params, function (success, results) {
    if (success) {
      console.log('Got file');
    }
    else {
      console.log('Error getting file');
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
    console.log('Connection established');
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
