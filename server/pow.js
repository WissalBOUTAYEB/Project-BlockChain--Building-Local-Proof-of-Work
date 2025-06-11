// pow.js
const crypto = require('crypto');

// Génère le hash d’un bloc
function calculateHash(index, previousHash, timestamp, data, nonce) {
  return crypto
    .createHash('sha256')
    .update(index + previousHash + timestamp + JSON.stringify(data) + nonce)
    .digest('hex');
}

// Effectue le minage en cherchant un hash avec un nombre de zéros initial
function mineBlock(index, previousHash, data, difficulty) {
  let nonce = 0;
  let timestamp = Date.now();
  let hash = calculateHash(index, previousHash, timestamp, data, nonce);

  const target = '0'.repeat(difficulty);

  while (!hash.startsWith(target)) {
    nonce++;
    timestamp = Date.now();
    hash = calculateHash(index, previousHash, timestamp, data, nonce);
  }

  return {
    index,
    timestamp,
    data,
    previousHash,
    nonce,
    hash,
  };
}

// Exports
module.exports = {
  calculateHash,
  mineBlock,
};
