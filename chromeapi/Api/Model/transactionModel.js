const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    to: String,
    amount: String,
});

const transaction = mongoose.model("transaction", transactionSchema);

module.exports = transaction;