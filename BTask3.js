document.addEventListener('DOMContentLoaded', function () {
    const balanceAmount = document.getElementById('balance-amount');
    const transactionForm = document.getElementById('transaction-form');
    const transactionsContainer = document.getElementById('transactions');

    // Fetch transactions and balance when the page loads
    fetchTransactions();

    // Add event listener to handle form submission
    transactionForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.getElementById('type').value;

        const response = await fetch('/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description, amount, type })
        });

        if (response.ok) {
            const data = await response.json();
            const newTransaction = createTransactionElement(data);
            transactionsContainer.prepend(newTransaction);
            updateBalance();
            transactionForm.reset();
        } else {
            alert('Error adding transaction');
        }
    });

    // Function to fetch transactions from the server
    async function fetchTransactions() {
        const response = await fetch('/transactions');
        const data = await response.json();

        data.forEach(transaction => {
            const transactionElement = createTransactionElement(transaction);
            transactionsContainer.appendChild(transactionElement);
        });

        updateBalance();
    }

    // Function to create HTML element for a transaction
    function createTransactionElement(transaction) {
        const transactionDiv = document.createElement('div');
        transactionDiv.classList.add('transaction');

        const descriptionPara = document.createElement('p');
        descriptionPara.textContent = transaction.description;

        const amountPara = document.createElement('p');
        amountPara.textContent = transaction.amount;

        transactionDiv.appendChild(descriptionPara);
        transactionDiv.appendChild(amountPara);

        if (transaction.type === 'expense') {
            transactionDiv.classList.add('expense');
        } else {
            transactionDiv.classList.add('income');
        }

        return transactionDiv;
    }

    // Function to update the balance
    async function updateBalance() {
        const response = await fetch('/balance');
        const data = await response.json();
        balanceAmount.textContent = `$${data.balance}`;
    }
});