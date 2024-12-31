import React, { useState, useEffect } from 'react';
import axios from 'axios';


axios.defaults.withCredentials = false;

const Payments = () => {
  const [accountSummaries, setAccountSummaries] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accountDetails, setAccountDetails] = useState(null);

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
            // total_payment_amount: summary.total_payment_amount || 0 
          };
        } else {
          acc[summary.account_number].total_balance += summary.total_balance || 0;
          // acc[summary.account_number].total_payment_amount += summary.Total_payment_amount || 0;
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
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/payment-schedules/?account_number=${accountNumber}`,
        { withCredentials: true }
      );
      
      const paidSchedules = response.data.filter(schedule => schedule.is_paid);

      setSchedules(paidSchedules);
      setSelectedAccount(accountNumber);

      const memberResponse = await axios.get(
        `http://127.0.0.1:8000/members/?account_number=${accountNumber}`,
        { withCredentials: true }
      );
      setAccountDetails(memberResponse.data[0]);
    } catch (err) {
      console.error('Error fetching schedules or account details:', err);
      setError('Failed to fetch payment schedules or account details.');
    } finally {
      setLoading(false);
    }
  };
  const calculatePaidBalance = () => {
    return schedules
      .reduce((total, schedule) => {
        if (schedule.is_paid || schedule.status === 'Paid') {
          return total + parseFloat(schedule.payment_amount || 0);
        }
        return total;
      }, 0)
      .toFixed(2);
  };

  useEffect(() => {
    fetchAccountSummaries();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="payments-container">
      {!selectedAccount ? (
        <>
          <h2>Paid Payments Overview</h2>
          {accountSummaries.length > 0 ? (
            <table className="account-summary-table">
              <thead>
                <tr>
                  <th>Account Number</th>
                  <th>Date</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {accountSummaries.map((summary, index) => (
                  <tr 
                    key={`${summary.account_number}-${index}`}
                    onClick={() => fetchPaymentSchedules(summary.account_number)}
                    style={{ cursor: 'pointer' }}>
                    <td style={{color: 'blue'}}>{summary.account_number || 'N/A'}</td>
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
              <h3>Payment History For:</h3>
              <p><strong>Name:</strong> {accountDetails.first_name} {accountDetails.last_name}</p>
              <p><strong>Account Number:</strong> {selectedAccount}</p>
              <p>
                <strong>Paid Balance:</strong> ₱ {calculatePaidBalance()}
              </p>
            </>
          )}

          {schedules.length > 0 ? (
            <table className="payment-schedule-table">
              <thead>
                <tr>
                  <th>Principal Amount</th>
                  <th>Interest</th>
                  <th>Service Fee</th>
                  <th>Paid Amount</th>
                  <th>Date Paid</th>
                  <th>Balance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule, index) => (
                  <tr key={`${schedule.id}-${schedule.loan}-${schedule.due_date}-${index}`}>
                    <td>₱ {(parseFloat(schedule.principal_amount) || 0).toFixed(2)}</td>
                    <td>₱ {(parseFloat(schedule.interest_amount) || 0).toFixed(2)}</td>
                    <td>₱ {(parseFloat(schedule.service_fee_component) || 0).toFixed(2)}</td>
                    <td>₱ {(parseFloat(schedule.payment_amount) || 0).toFixed(2)}</td>
                    <td>{new Date(schedule.due_date).toLocaleDateString()}</td>
                    <td>₱ {(parseFloat(schedule.balance) || 0).toFixed(2)}</td>
                    <td style={{ color: 'green' }}>Paid</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No paid payments found for this account.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Payments;
