let crypto = require('crypto');
let fs = require('fs');


let { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

// Ghi file private.pem và public.pem vào thư mục gốc
fs.writeFileSync('private.pem', privateKey);
fs.writeFileSync('public.pem', publicKey);

console.log("private.pem and public.pem created successfully.");