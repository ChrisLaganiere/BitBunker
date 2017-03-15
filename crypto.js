// ENCRYPT FILES
// var encryptor = require('file-encryptor');

var crypto = {};

var secrets = require('./secrets.json'); //this is the top secret file with all the passwords! 
//If it contains a JSON object with a supersecretkey field, the value of that field will be used as the key
//

// var key = secrets.supersecretkey;

// var encrypt_file = function(inputfile, outputfile){
// 	encryptor.encrypt_file(inputfile, outputfile, key, function(err){ 
// 		//encryption complete
// 		if(err){
// 			console.log('encryption failed');
// 		}
// 	});
// };

// var decrypt_file = function(inputfile, outputfile){
// 	encryptor.decrypt_file(inputfile, outputfile, key, function(err) {
// 		//decryption complete
// 		if(err){
// 			console.log('encryption failed');
// 		}
// 	});
// };

//ENCRYPT PASSWORDS
var bcrypt = require('bcrypt');
const saltRounds = 12; //make this bigger if you're paranoid

//callback takes 2 arguments, err and hash. One or the other, but not both, will be equal to null
//if err==null, then bcrypt successfully hashed the string and 'hash' contains the string
//otherwise, bcrypt failed to hash the string, 'err' contains the error that bcrypt reported, and 'hash'==null
crypto.hash_string = function(plaintext, callback) {
	bcrypt.hash(plaintext, saltRounds, function(err, hash) {
		if (err) {
			console.log('failed to hash string');
			callback(err, null);
		}
		else {
			callback(null, hash);
		}
	});
};

crypto.compare_string = function(plaintext, hash, callback) {
	bcrypt.compare(plaintext, hash).then(function(result) {
		if (result) {
			//the strings are the same 
			callback(true);
		}
		else {
			//the strings are different
			callback(false);
		}
	});
};

module.exports = crypto;
