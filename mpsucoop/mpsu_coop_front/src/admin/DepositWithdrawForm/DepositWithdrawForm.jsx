import React, { useState } from 'react';
import axios from 'axios';


function DepositWithdrawForm({ account, actionType, onClose, fetchAccounts, setError }) {
  const [amount, setAmount] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = actionType === 'deposit' 
        ? `http://localhost:8000/accounts/${account.account_number}/deposit/`
        : `http://localhost:8000/accounts/${account.account_number}/withdraw/`;

      await axios.post(endpoint, { amount });
      fetchAccounts(); 
      onClose();
    } catch (err) {
      setError(err.response ? err.response.data.message : err.message);
    }
  };

  return (
    <div>
      <h2>{actionType === 'deposit' ? 'Deposit' : 'Withdraw'} Funds</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Amount:
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            required 
          />
        </label>
        <button type="submit">{actionType === 'deposit' ? 'Deposit' : 'Withdraw'}</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}

export default DepositWithdrawForm;
