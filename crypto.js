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

//callback takes 2 arguments, err and hash. One or the other, but not both, will be equal to null
//if err==null, then bcrypt successfully hashed the password and 'hash' contains the password
//otherwise, bcrypt failed to hash the password, 'err' contains the error that bcrypt reported, and 'hash'==null
var hash_password = function(plaintextpassword, callback){
	bcrypt.hash(plaintextpassword, saltRounds, function(err, hash) {
		if(err){
			console.log('failed to hash password');
			callback(err, null); 

		}
		else{
			//store hash in password database, associated with the vaultname field 
			callback(null, hash)
		}
	});
}

var compare_password = function(plaintextpassword, hash, callback){
	bcrypt.compare(plaintextpassword, hash).then(function(result){
		if(result){
			//the passwords are the same 
			callback(true);
		}
		else{
			//the passwords are different
			callback(false); 
		}
	});
}



