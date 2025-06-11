const Block = require('./block');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db');

class Blockchain {
  constructor() {
    if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath);

    this.chain = [];
    this.difficulty = 3;  // ajustable
    this.mempool = [];
    this.blockReward = 50;

    if (this.loadChain()) {
      console.log('Blockchain loaded.');
    } else {
      console.log('Creating genesis block...');
      this.chain.push(this.createGenesisBlock());
      this.saveBlock(this.chain[0]);
    }
  }

  createGenesisBlock() {
    return new Block(0, "0", Date.now(), ["Genesis Block"]);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
    this.saveBlock(newBlock);
  }

  saveBlock(block) {
    fs.writeFileSync(path.join(dbPath, `block${block.index}.json`), JSON.stringify(block, null, 2));
  }

  loadChain() {
    try {
      const files = fs.readdirSync(dbPath).filter(f => f.endsWith('.json'));
      if (files.length === 0) return false;
      this.chain = files
        .map(f => JSON.parse(fs.readFileSync(path.join(dbPath, f))))
        .sort((a, b) => a.index - b.index);
      return true;
    } catch {
      return false;
    }
  }

  addTransaction(tx) {
    this.mempool.push(tx);
  }

  minePendingTransactions(minerAddress) {
    // Ajoute une tx de récompense pour le mineur
    const rewardTx = { from: "system", to: minerAddress, amount: this.blockReward };
    const transactions = [...this.mempool, rewardTx];

    const newBlock = new Block(this.chain.length, this.getLatestBlock().hash, Date.now(), transactions);
    this.addBlock(newBlock);

    this.mempool = [];
  }

  getBalance(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.to === address) balance += tx.amount;
        if (tx.from === address) balance -= tx.amount;
      }
    }
    return balance;
  }
}

module.exports = Blockchain;
