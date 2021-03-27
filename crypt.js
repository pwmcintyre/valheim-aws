const crypto = require('crypto');

const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');

const message = 'Hello world!';
console.log(message);

const signature = crypto.sign(null, Buffer.from(message), privateKey);
console.log(signature);

const verified = crypto.verify(null, Buffer.from(message), publicKey, signature)
console.log('Match:', verified);
console.log('publicKey:', publicKey);
