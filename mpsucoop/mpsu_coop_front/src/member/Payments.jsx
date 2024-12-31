import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Topbar from './Topbar/Topbar';

const Payments = () => {
  const { control_number } = useParams(); 
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
          throw new Error("Access token is missing. Please log in.");
        }

        const response = await fetch(
          `http://localhost:8000/api/payments/${control_number}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Session expired. Please log in again.");
          } else if (response.status === 404) {
            throw new Error("Payments not found for this loan.");
          } else {
            throw new Error("Failed to fetch payments.");
          }
        }

        const data = await response.json();
        setPayments(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching payments:", err);
        setError(err.message || "Unable to load payments.");
        setLoading(false);
      }
    };

    fetchPayments();
  }, [control_number]);

  if (loading) {
    return <div>Loading payments...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
    <Topbar/>
      <h2>Payments for Loan {control_number}</h2>
      {payments.length > 0 ? (
        <table>
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
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.principal_amount}</td>
                <td>{payment.interest}</td>
                <td>{payment.service_fee}</td>
                <td>{payment.paid_amount}</td>
                <td>{payment.date_paid || "N/A"}</td>
                <td>{payment.balance}</td>
                <td>{payment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No payments found for this loan.</div>
      )}
    </div>
  );
};

export default Payments;
