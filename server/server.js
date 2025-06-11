const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');

const app = express();
const PORT = 3000;

const blockchain = new Blockchain();

app.use(bodyParser.json());
app.use(express.static('../web'));  // sert dossier web

// API: Récupérer blockchain
app.get('/api/chain', (req, res) => {
  res.json(blockchain.chain);
});

// API: Récupérer mempool
app.get('/api/mempool', (req, res) => {
  res.json(blockchain.mempool);
});

// API: Envoyer transaction
app.post('/api/transaction', (req, res) => {
  const { from, to, amount } = req.body;
  if (!from || !to || !amount) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  // Ici, pas de signature, pas de vérification, juste simple demo
  if (blockchain.getBalance(from) < amount) {
    return res.status(400).json({ error: 'Insufficient funds' });
  }
  blockchain.addTransaction({ from, to, amount });
  res.json({ message: 'Transaction added to mempool' });
});

// API: Miner bloc (envoie adresse mineur)
app.post('/api/mine', (req, res) => {
  const { minerAddress } = req.body;
  if (!minerAddress) {
    return res.status(400).json({ error: 'Missing minerAddress' });
  }
  blockchain.minePendingTransactions(minerAddress);
  res.json({ message: 'Block mined successfully' });
});

// API: Balance d'une adresse
app.get('/api/balance/:address', (req, res) => {
  const balance = blockchain.getBalance(req.params.address);
  res.json({ address: req.params.address, balance });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
