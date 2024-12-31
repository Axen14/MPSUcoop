import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Topbar from './Topbar/Topbar';

const PaymentSchedule = () => {
  const { control_number } = useParams(); 
  const [paymentSchedules, setPaymentSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentSchedules = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await fetch(`http://localhost:8000/api/payment-schedules/${control_number}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch payment schedules.");
        }

        const data = await response.json();
        setPaymentSchedules(data);
        setLoading(false);
      } catch (err) {
        setError("Unable to load payment schedules.");
        setLoading(false);
      }
    };

    fetchPaymentSchedules();
  }, [control_number]);

  if (loading) {
    return <div>Loading payment schedules...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
    <Topbar />
      <h2>MY PAYMENT SCHEDULES </h2>
      {paymentSchedules.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Due Date</th>
              <th>Principal Amount</th>
              <th>Interest Amount</th>
              <th>Service Fee</th>
              <th>Amount Due</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paymentSchedules.map((schedule) => (
              <tr key={schedule.id} style={{ color: 'black' }}>
                <td>{schedule.due_date}</td>
                <td>{schedule.principal_amount}</td>
                <td>{schedule.interest_amount}</td>
                <td>{schedule.service_fee_component}</td>
                <td>{schedule.payment_amount || "N/A"}</td>
                <td>{schedule.is_paid ? "Paid" : "Pending"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No payment schedules found for this loan.</div>
      )}
    </div>
  );
};

export default PaymentSchedule;
