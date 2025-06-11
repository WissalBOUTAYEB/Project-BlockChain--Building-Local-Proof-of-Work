const crypto = require('crypto');

class Block {
  constructor(index, previousHash, timestamp, transactions, nonce = 0) {
    this.index = index;
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.nonce = nonce;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    const data = this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  mineBlock(difficulty) {
    while (!this.hash.startsWith('0'.repeat(difficulty))) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}

module.exports = Block;
