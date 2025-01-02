import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Topbar from '../Topbar/Topbar';

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");  

    console.log("Access Token:", accessToken);  
    if (!accessToken) {
      setError("Please log in to view your loans.");
      setLoading(true);
      navigate("/home");  
      return;
    }

    
    fetchLoans();
  }, [navigate]);

  const fetchLoans = async () => {
    const accountNumber = localStorage.getItem("accountN");

    if (!accountNumber) {
      setError("Account number is missing");
      setLoading(false);
      return;
    }

    try {
      const url = filter
        ? `http://localhost:8000/api/loans/by_account?account_number=${accountNumber}&filter=${filter}`
        : `http://localhost:8000/api/loans/by_account?account_number=${accountNumber}`;
      
      const accessToken = localStorage.getItem("accessToken");  
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          navigate("/");  
        } else {
          throw new Error(`Failed to fetch loans: ${response.status} - ${errorText}`);
        }
      }

      const data = await response.json();
      setLoans(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching loans:", err);
      setError("Unable to connect to the server. Please try again later.");
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div >
    <Topbar />
      <h2>MY Loans</h2>
      <label htmlFor="filter">Filter Loans: </label>
      <select id="filter" onChange={(e) => setFilter(e.target.value)}>
        <option value="">All</option>
        <option value="Pending">Pending</option>
        {/* <option value="Approved">Approved</option> */}
        <option value="Paid">Paid</option>
      </select>

      {loans.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Loan Term (mos)</th>
              <th>Type</th>
              <th>Interest (%)</th>
              <th>Service Fee</th>
              <th>Take Home Pay</th>
              <th>Status</th>
              <th>Purpose</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody >
            {loans.map((loan) => (
              <tr key={loan.control_number} style={{ color: 'black' }}>
                <td>{loan.loan_amount}</td>
                <td>{loan.loan_period}</td>
                <td>{loan.loan_type}</td>
                <td>{loan.interest_rate}</td>
                <td>{loan.service_fee}</td>
                <td>{loan.takehomePay}</td>
                <td>{loan.status}</td>
                <td>{loan.purpose}</td>
                <td>
                  <Link to={`/payment-schedules/${loan.control_number}`}>
                    View Payment Schedule
                  </Link>
                  <Link to={`/payments/${loan.scheduleId}`}>
                    View Payment
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No loans found for this account number.</div>
      )}
    </div>
  );
};

export default Loans;
