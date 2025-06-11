// wallet.js
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Génère une nouvelle paire de clés (RSA)
function generateWallet() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  const walletDir = path.join(__dirname, 'wallet');
  if (!fs.existsSync(walletDir)) fs.mkdirSync(walletDir);

  fs.writeFileSync(path.join(walletDir, 'public.pem'), publicKey);
  fs.writeFileSync(path.join(walletDir, 'private.pem'), privateKey);

  console.log('✅ Wallet généré avec succès dans le dossier wallet/');
}

// Signe une transaction (objet ou stringifié) avec la clé privée
function signTransaction(transaction, privateKeyPath) {
  const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
  const sign = crypto.createSign('SHA256');
  sign.update(JSON.stringify(transaction)).end();
  const signature = sign.sign(privateKey, 'hex');
  return signature;
}

// Vérifie la signature avec la clé publique
function verifyTransaction(transaction, signature, publicKeyPath) {
  const publicKey = fs.readFileSync(publicKeyPath, 'utf-8');
  const verify = crypto.createVerify('SHA256');
  verify.update(JSON.stringify(transaction)).end();
  return verify.verify(publicKey, signature, 'hex');
}

// Exemple d'utilisation
if (require.main === module) {
  generateWallet();

  // Exemple de transaction
  const tx = {
    from: 'AlicePublicKey',
    to: 'BobPublicKey',
    amount: 10,
    fee: 1
  };

  const signature = signTransaction(tx, './wallet/private.pem');
  console.log('\n🔐 Signature:', signature);

  const isValid = verifyTransaction(tx, signature, './wallet/public.pem');
  console.log('✅ Signature valide ? ', isValid);
}

// Exports
module.exports = { generateWallet, signTransaction, verifyTransaction };
