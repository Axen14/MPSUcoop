import React, { useState } from 'react';
import axios from 'axios';

const AddPaymentForm = ({ onClose, fetchPayments }) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [paymentSchedules, setPaymentSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  const handleAccountSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoans([]);
    setPaymentSchedules([]);
    setSelectedLoan(null);

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/accounts/${accountNumber}/active-loans/`
      );

      if (response.data.active_loans.length > 0) {
        const activeLoans = response.data.active_loans.filter(
          (loan) => loan.status !== 'Paid' && loan.status !== 'Closed'
        );
        setLoans(activeLoans);
      } else {
        setError('No active loans found for this account number.');
      }
    } catch (err) {
      setError('Failed to fetch loans. Please check the account number and try again.');
    }
  };
  const fetchPaymentSchedules = async (controlNumber) => {
    setError('');
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/loans/${controlNumber}/payment-schedules/`
      );
      const unpaidSchedules = response.data.filter(
        (schedule) => schedule.status !== 'Paid'
      );
      unpaidSchedules.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
      setPaymentSchedules(unpaidSchedules);
      setSelectedLoan(controlNumber);
    } catch (err) {
      setError('Failed to fetch payment schedules.');
    }
  };

  const handlePaymentSubmit = async () => {
    setError('');
    setSuccessMessage('');

    if (!selectedSchedule) {
      setError('Please select a payment schedule.');
      return;
    }

    try {
      const paymentData = {
        loan: selectedLoan,
        payment_schedule: selectedSchedule,
      };

      const response = await axios.post('http://127.0.0.1:8000/payments/', paymentData);

      if (response.status === 201) {
        setSuccessMessage('Payment recorded successfully!');
        fetchPayments();
        onClose(); 
      }
    } catch (err) {
      setError('Failed to create payment. Please try again.');
    }
  };

  return (
    <div>
      <h3>Enter Account Number</h3>
      <form onSubmit={handleAccountSubmit}>
        <input
          type="text"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="Account Number"
          required
        />
        <button type="submit">Check Active Loans</button>
      </form>

      {loans.length > 0 && (
        <div>
          <h3>Select a Loan</h3>
          {loans.map((loan) => (
            <button key={loan.control_number} onClick={() => fetchPaymentSchedules(loan.control_number)}>
              Loan #{loan.control_number} (Due: {new Date(loan.due_date).toLocaleDateString()})
            </button>
          ))}
        </div>
      )}

      {paymentSchedules.length > 0 && (
        <div>
          <h3>Payment Schedules for Loan #{selectedLoan}</h3>
          <ul>
            {paymentSchedules.map((schedule) => (
              <li key={schedule.id}>
                <label>
                  <input
                    type="radio"
                    name="schedule"
                    value={schedule.id}
                    onChange={() => setSelectedSchedule(schedule.id)}
                  />
                  Due: {new Date(schedule.due_date).toLocaleDateString()} - Amount: {schedule.payment_amount.toFixed(2)}
                </label>
              </li>
            ))}
          </ul>
          <button onClick={handlePaymentSubmit}>Submit Payment</button>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default AddPaymentForm;
