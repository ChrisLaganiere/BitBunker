// ENCRYPT FILES
var encryptor = require('file-encryptor');

var secrets = require('./secrets.json'); //this is the top secret file with all the passwords! 
//If it contains a JSON object with a supersecretkey field, the value of that field will be used as the key
//

var key = secrets.supersecretkey;

encrypt_file(var inputfile, var outputfile)
{
	encryptor.encrypt_file(inputfile, outputfile, key, function(err){ 
		//encryption complete
	});
}

decrypt_file(var inputfile, var outputfile)
{
	encryptor.decrypt_file(inputfile, outputfile, key, function(err){
		//decryption complete
	});
}

//ENCRYPT PASSWORDS (the hard part)