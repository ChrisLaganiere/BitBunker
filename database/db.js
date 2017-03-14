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
/*
db.filesForVault = function(vaultname, callback) {
  callback([
    {
      id: 12345,
      vault: "somevault",
      location: "12345.txt"
    }
  ]);
};
*/

//create vault
db.createVault = function(vault, pwd, callback){
  var insert = 'INSERT INTO Vaults (vault_name, vault_pwd) ' + 'VALUES(?, ?) '
  + con.escape(vault, pwd); 
  con.query(insert, function(err, results) {
      if(err){
        console.log('Error creating Vault')
        callback(false)
      }
      else{
        console.log('Vault has been created!')
        callback(true)
      }
  
  }); 
}


//add file to vault
db.addFile = function(name, path, vault, callback){
  var insert = 'INSERT INTO Files (file_name, file_path, vault_name) ' + 'VALUES(?, ?, ?) '
  + con.escape(name, path, vault); 
  con.query(insert, function(err, results) {
      if(err){
        console.log('Error adding file')
        callback(false)
      }
      else{
        console.log('File added to vault!')
        callback(true)
      }
  
  }); 
}


//delete file from vault
db.deleteFile = function(name, vault, callback){
  var del = 'DELETE FROM Files WHERE file_name = ? AND vault_name = ?' + con.escape(name, vault); 
  con.query(del, function(err, results) {
      if(err){
        console.log('Error deleting file')
        callback(false)
      }
      else{
        console.log('File deleted from vault!')
        callback(true)
      }
  }); 
}


//get file vault
db.getFile = function(file_name, vault, callback) {
  var exec = 'SELECT * FROM Table WHERE file_name = ? vault_name = ?' + con.escape(file_name, vault); 
  con.query(exec,  function(err, rows) {
    if (err) {
      console.log('Error getting file from vault')
      callback(false, null);
    }
    else{
      console.log('File found in vault!')
      callback(true, file_name)
    } 
  });
}



//opens vault 
db.openVault = function(vault, pwd, callback) {
  var exec = 'SELECT * FROM Vaults WHERE vault_name = ? AND vault_pwd = ?' + con.escape(vault, pwd); 
  con.query(exec,  function(err, rows) {
    if (err) {
      console.log('Error making query for vaults')
      callback(false);
    }
    else{
      console.log('Vault found!')
      console.log(rows)
      callback(true)
    } 
  });
}



module.exports = db;
