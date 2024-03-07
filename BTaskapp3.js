const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/moneyTrackerDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Create a transaction schema
const transactionSchema = new mongoose.Schema({
    description: String,
    amount: Number,
    type: String
});

// Create a transaction model
const Transaction = mongoose.model('Transaction', transactionSchema);

// Body parser middleware
app.use(bodyParser.json());

// Serve static files
app.use(express.static('public'));

// Route for rendering the home page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/BTask3.html');
});

// Route for fetching all transactions
app.get('/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route for creating a new transaction
app.post('/transactions', async (req, res) => {
    const { description, amount, type } = req.body;

    try {
        const newTransaction = new Transaction({ description, amount, type });
        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Route for fetching the balance
app