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


//create database for BitBunker
con.query('CREATE Database BitBunker',
 function(err, result){
  // Case there is an error during the creation
  if(err) {
      console.log(err);
  } else {
      console.log("BitBunker Database Created");
  }
});  


//create table vaults 
con.query('CREATE TABLE Vaults (vault_name VARCHAR(256) NOT NULL UNIQUE, vault_pwd VARCHAR(256) NOT NULL,' +
           'num_files int, PRIMARY KEY(vault_name))',
 function(err, result){
  // Case there is an error during the creation
  if(err) {
      console.log(err);
  } else {
      console.log("Table Vaults Created");
  }
}); 


//create table files 
//fields for files: 
//file_name varchar(256) NOT NULL
//content string NOT NULL
//vault_name varchar(256) NOT NULL 
con.query('CREATE TABLE Files (file_name VARCHAR(256) NOT NULL UNIQUE, file_path string NOT NULL,' +
           'vault_name varchar(256), PRIMARY KEY(file_name))',
 function(err, result){
  // Case there is an error during the creation
  if(err) {
      console.log(err);
  } else {
      console.log("Table Files Created");
  }
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
