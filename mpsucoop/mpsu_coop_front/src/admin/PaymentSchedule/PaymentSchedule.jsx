import React, { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = false;

const PaymentSchedule = () => {
  const [accountSummaries, setAccountSummaries] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accountDetails, setAccountDetails] = useState(null);
  const [paying, setPaying] = useState(false);
  const [loanType, setLoanType] = useState('Regular'); 

  
  const fetchAccountSummaries = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://127.0.0.1:8000/payment-schedules/summaries/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

     
      const uniqueSummaries = response.data.reduce((acc, summary) => {
        if (!acc[summary.account_number]) {
          acc[summary.account_number] = { 
            ...summary, 
            total_balance: summary.total_balance || 0 ,
            total_payment_amount: summary.total_payment_amount || 0 
          };
        } else {
          acc[summary.account_number].total_balance += summary.total_balance || 0;
          acc[summary.account_number].total_payment_amount += summary.total_payment_amount || 0;
        }
        return acc;
      }, {});

      
      setAccountSummaries(Object.values(uniqueSummaries));
    } catch (err) {
      console.error('Error fetching account summaries:', err);
      setError('Failed to fetch account summaries.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentSchedules = async (accountNumber) => {
    setSchedules([]);
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/payment-schedules/?account_number=${accountNumber}&loan_type=${loanType}`, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      setSchedules(response.data);
      setSelectedAccount(accountNumber);

      const memberResponse = await axios.get(
        `http://127.0.0.1:8000/members/?account_number=${accountNumber}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      setAccountDetails(memberResponse.data[0]);
    } catch (err) {
      console.error('Error fetching schedules or account details:', err);
      setError('Failed to fetch payment schedules or account details.');
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (id) => {
    setPaying(true);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/payment-schedules/${id}/mark-paid/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Payment schedule marked as paid:', response.data);
      setSchedules((prevSchedules) =>
        prevSchedules.map((s) =>
          s.id === id ? { ...s, is_paid: true, status: 'Paid' } : s
        )
      );
    } catch (err) {
      console.error('Error while marking as paid:', err.response ? err.response.data : err.message);
    } finally {
      setPaying(false);
    }
  };

  const calculateRemainingBalance = () => {
    return schedules
      .reduce((total, schedule) => {
        if (!schedule.is_paid || schedule.status === 'Pending') {
          return total + parseFloat(schedule.payment_amount || 0);
        }
        return total;
      }, 0)
      .toFixed(2);
  };

  const handleLoanTypeChange = (type) => {
    setLoanType(type);
    if (selectedAccount) {
      fetchPaymentSchedules(selectedAccount); 
    }
  };

  useEffect(() => {
    fetchAccountSummaries();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="payment-schedule-container">
      {!selectedAccount ? (
        <>
          <h2>Ongoing Payment Schedules</h2>
          {accountSummaries.length > 0 ? (
            <table className="account-summary-table">
              <thead>
                <tr>
                  <th>Account Number</th>
                  <th>Next Due Date</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {accountSummaries.map((summary) => (
                  <tr
                    key={summary.account_number}
                    onClick={() => fetchPaymentSchedules(summary.account_number)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ color: 'blue' }}>{summary.account_number || 'N/A'}</td>
                    <td>{summary.next_due_date ? new Date(summary.next_due_date).toLocaleDateString() : 'No Due Date'}</td>
                    <td>₱ {summary.total_balance?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No ongoing schedules found.</p>
          )}
        </>
      ) : (
        <>
          <button onClick={() => setSelectedAccount(null)}>Back to List</button>
          {accountDetails && (
            <>
              <h3>Payment Schedule For:</h3>
              <p>
                <strong>Name:</strong> {accountDetails.first_name} {accountDetails.last_name}
              </p>
              <p>
                <strong>Account Number:</strong> {selectedAccount}
              </p>
              <p>
                <strong>Remaining Balance:</strong> ₱ {calculateRemainingBalance()}
              </p>
              <div>
                <button onClick={() => handleLoanTypeChange('Regular')}>Regular Loan</button>
                <button onClick={() => handleLoanTypeChange('Emergency')}>Emergency Loan</button>
              </div>
            </>
          )}

          {schedules.length > 0 ? (
            <table className="payment-schedule-table">
              <thead>
                <tr>
                  <th>Principal Amount</th>
                  <th>Interest Amount</th>
                  <th>Service Fee</th>
                  <th>Payment Amount</th>
                  <th>Due Date</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule) => (
                  <tr key={schedule.id}>
                    <td>₱ {(parseFloat(schedule.principal_amount) || 0).toFixed(2)}</td>
                    <td>₱ {(parseFloat(schedule.interest_amount) || 0).toFixed(2)}</td>
                    <td>₱ {(parseFloat(schedule.service_fee_component) || 0).toFixed(2)}</td>
                    <td>₱ {(parseFloat(schedule.payment_amount) || 0).toFixed(2)}</td>
                    <td>{new Date(schedule.due_date).toLocaleDateString()}</td>
                    <td>₱ {(parseFloat(schedule.balance) || 0).toFixed(2)}</td>
                    <td style={{ color: schedule.is_paid ? 'green' : 'red' }}>
                      {schedule.is_paid ? 'Paid' : 'Pending'}
                    </td>
                    <td>
                      {!schedule.is_paid && (
                        <button
                          style={{ backgroundColor: 'goldenrod', color: 'white' }}
                          onClick={() => markAsPaid(schedule.id)}
                        >
                          {paying ? 'Processing...' : 'Pay'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No payment schedules found for this account.</p>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentSchedule;
