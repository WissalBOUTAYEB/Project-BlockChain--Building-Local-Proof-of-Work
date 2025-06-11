document.getElementById('txForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const tx = {
    sender: sender.value,
    recipient: recipient.value,
    amount: parseInt(amount.value),
    fee: parseInt(fee.value),
    signature: signature.value
  };
  await fetch('/transaction', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(tx)
  });
});

async function loadChain() {
  const res = await fetch('/blockchain');
  const chain = await res.json();
  document.getElementById('chain').textContent = JSON.stringify(chain, null, 2);
}

setInterval(loadChain, 5000);
