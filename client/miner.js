const axios = require('axios');
const { mineBlock } = require('../server/pow');

const newBlock = mineBlock(
  1,
  '0000000000abcdef', // previousHash
  [{ from: 'A', to: 'B', amount: 10 }],
  4 // difficulté (nombre de zéros au début du hash)
);

console.log('Bloc miné :', newBlock);


async function mine() {
  const res = await axios.post('http://localhost:3000/mine');
  console.log(res.data);
}

setInterval(mine, 60000); // toutes les minutes
