class Cipher {
    constructor(encodePassword,decodePassword){
        this.encodePassword = encodePassword.slice();
        this.decodePassword = decodePassword.slice();
    };
    decode(buffer){
       return buffer.map(value=>this.decodePassword[value])
    }
    encode(buffer){
       return buffer.map(value=>this.encodePassword[value])
    }
};

Cipher.createCipher = function(encodePassword){
    if(typeof(encodePassword) === 'string'){
        encodePassword = Buffer.from(encodePassword,'base64');
    }
    let decodePassword = new Buffer(256);
    //encodePassword.copy(decodePassword);
    for(let i = 0;i < decodePassword.length;i++){
        let value = encodePassword[i];
        decodePassword.writeUInt8(i,value);
    }
    return new Cipher(encodePassword,decodePassword);
};

module.exports = Cipher;