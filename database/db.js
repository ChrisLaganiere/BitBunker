// db.js
// connects to and handles database

var mysql = require("mysql");
var secrets = require('../secrets.json');

// First you need to create a connection to the db
var con = mysql.createConnection({
  host: "localhost",
  user: secrets.dbusername,
  password: secrets.dbpassword
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

con.end(function(err) {
  // The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
});

var db = {};

db.filesForVault = function(vaultname, callback) {
  callback([
    {
      id: 12345,
      vault: "somevault",
      location: "12345.txt"
    }
  ]);
};

db.openVault = function(vault, secret, callback) {
  con.query('SELECT * FROM vaults WHERE name = ' + vault + ' AND secret = ' + secret, function(err, rows) {
    /// ... 
    if (rows) {
      callback(true);
    } else {
      callback(false);
    }
  });
}

module.exports = db;
