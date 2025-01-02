import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // For scheduleId

const MemberPayments = () => {
  const { scheduleId } = useParams(); // Get scheduleId from the URL
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      // Ensure scheduleId is valid before making the API request
      if (scheduleId) {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/member-payments/?schedule=${scheduleId}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
              },
            }
          );
          setPayments(response.data);
        } catch (err) {
          setError('Failed to fetch payments. Please try again later.');
        } finally {
          setLoading(false);
        }
      } else {
        setError('Invalid schedule ID.');
        setLoading(false);
      }
    };

    fetchPayments();
  }, [scheduleId]); // Run useEffect when scheduleId changes

  if (loading) return <p>Loading payments...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>My Payments</h2>
      {payments.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Loan Control Number</th>
              <th>Due Date</th>
              <th>Principal Amount</th>
              <th>Interest Amount</th>
              <th>Service Fee</th>
              <th>Paid Amount</th>
              <th>Date Paid</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.OR}>
                <td>{payment.payment_schedule.loan.control_number}</td>
                <td>{payment.payment_schedule.due_date}</td>
                <td>₱ {parseFloat(payment.payment_schedule.principal_amount).toFixed(2)}</td>
                <td>{payment.payment_schedule.service_fee_component}</td>
                <td>₱ {parseFloat(payment.payment_amount).toFixed(2)}</td>
                <td>
                  {payment.date_paid
                    ? new Date(payment.date_paid).toLocaleDateString()
                    : 'Not Paid'}
                </td>
                <td>{payment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No payments found.</p>
      )}
    </div>
  );
};

export default MemberPayments;
