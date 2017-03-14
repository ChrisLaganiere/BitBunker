var crypto = require('crypto');

var AESCrypt = {};

AESCrypt.decrypt = function(cryptkey, iv, encryptdata) {
    encryptdata = new Buffer(encryptdata, 'base64').toString('binary');

    var decipher = crypto.createDecipheriv('aes-256-cbc', cryptkey, iv),
        decoded  = decipher.update(encryptdata, 'binary', 'utf8');

    decoded += decipher.final('utf8');
    return decoded;
}

AESCrypt.encrypt = function(cryptkey, iv, cleardata) {
    var encipher = crypto.createCipheriv('aes-256-cbc', cryptkey, iv),
        encryptdata  = encipher.update(cleardata, 'binary', 'utf8');

    encryptdata += encipher.final('binary');
    encode_encryptdata = new Buffer(encryptdata, 'binary').toString('base64');
    return encode_encryptdata;
}

module.exports = AESCrypt;
