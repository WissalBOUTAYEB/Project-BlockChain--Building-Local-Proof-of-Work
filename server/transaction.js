module.exports = class Transaction {
  constructor(sender, recipient, amount, fee, signature) {
    this.sender = sender;
    this.recipient = recipient;
    this.amount = amount;
    this.fee = fee;
    this.signature = signature;
  }
};
