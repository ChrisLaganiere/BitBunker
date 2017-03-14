// ENCRYPT FILES
var encryptor = require('file-encryptor');

var secrets = require('./secrets.json'); //this is the top secret file with all the passwords! 
//If it contains a JSON object with a supersecretkey field, the value of that field will be used as the key
//

var key = secrets.supersecretkey;

var encrypt_file = function(inputfile, outputfile){
	encryptor.encrypt_file(inputfile, outputfile, key, function(err){ 
		//encryption complete
		if(err){
			console.log('encryption failed');
		}
	});
};

var decrypt_file = function(inputfile, outputfile){
	encryptor.decrypt_file(inputfile, outputfile, key, function(err){
		//decryption complete
		if(err){
			console.log('encryption failed');
		}
	});
};

//ENCRYPT PASSWORDS
var bcrypt = require('bcrypt');
const saltRounds = 12; //make this bigger if you're paranoid

var hash_password = function(plaintextpassword, vaultname){
	bcrypt.hash(plaintextpassword, saltRounds, function(err, hash) {
		if(err){
			console.log('failed to hash password');
			return false;
		}
		else{
			//store hash in password database, associated with the vaultname field 
			return true;
		}
	});
}

var hash = ""; 
var compare_password = function(plaintextpassword, vaultname){
	var hash = ""; //this should be loaded from the database associated with the vaultname
	bcrypt.compare(plaintextpassword, hash).then(function(result){
		if(result){
			//the passwords are the same 
			return true;
		}
		else{
			//the passwords are different
			return false; 
		}
	});
}



