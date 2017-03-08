// db.js
// connects to and handles database

var mysql = require("mysql");
var secrets = require('../../secrets.json');

// First you need to create a connection to the db
var con = mysql.createConnection({
  host: "localhost",
  user: secrets.dbusername,
  password: secrets.dbpassword
  
});

con.connect(function(err){
  if(err){
    console.error('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

con.query('SELECT * FROM user = ?',function(err,rows){
  if(err) throw err;

  console.log('Data received from Db:\n');
  console.log(rows);
});

con.end(function(err) {
  // The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
});

// con.query('CREATE TABLE')
