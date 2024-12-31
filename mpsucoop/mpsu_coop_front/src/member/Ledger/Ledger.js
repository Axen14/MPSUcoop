import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './AccountM.css';

const Ledger = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const accountNumber = localStorage.getItem('accountN'); 
  const userRole = localStorage.getItem('userRole'); 

  useEffect(() => {
    setIsAdmin(userRole === 'admin');

    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken'); 
        if (!accountNumber || !token) {
          setError('Account number or token missing.');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:8000/api/account/${accountNumber}/transactions/`,
          {
            headers: { Authorization: `Bearer ${token}` }, 
          }
        );

        setTransactions(response.data.transactions); 
      } catch (err) {
        setError('Failed to fetch transactions. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [accountNumber, userRole]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <h1>{isAdmin ? 'All Transactions' : 'Your Transactions'}</h1>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Transaction Type</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Balance After Transaction</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.transaction_type}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.description}</td>
              <td>{transaction.balance_after_transaction}</td>
              <td>{new Date(transaction.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Ledger;
