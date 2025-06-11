let mempool = [];

module.exports = {
  addTransaction: (tx) => mempool.push(tx),
  getTransactions: () => [...mempool],
  clearTransactions: (txs) => {
    mempool = mempool.filter(tx => !txs.includes(tx));
  }
};
