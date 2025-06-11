const crypto = require('crypto');
const fs = require('fs');

const privateKey = fs.readFileSync('private.pem', 'utf8');

const data = JSON.stringify({
  sender: 'publicKeyHere',
  recipient: 'recipientAddress',
  amount: 10,
  fee: 1
});

const signer = crypto.createSign('sha256');
signer.update(data);
signer.end();

const signature = signer.sign(privateKey, 'hex');
console.log('Signature:', signature);