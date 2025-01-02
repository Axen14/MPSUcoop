import React, { useEffect, useState } from 'react';
import Topbar from '../Topbar/Topbar';
import './Home.css';
import axios from 'axios';

const Home = () => {
  const [memberData, setMemberData] = useState(null);
  const [loanData, setLoanData] = useState(null);
  const [paymentSchedules, setPaymentSchedules] = useState([]);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        if (!token) {
          setError("No authentication token found. Please log in again.");
          return;
        }

        // Fetch Member Data
        const memberResponse = await axios.get('http://localhost:8000/api/member/profile/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const memberResponseData = memberResponse.data;
        console.log("Member Data:", memberResponse.data);

        if (memberResponseData.accountN) {
          localStorage.setItem('accountN', memberResponseData.accountN);
          console.log("Stored accountN in localStorage:", memberResponseData.accountN);
        } else {
          console.error("accountN is missing in member data.");
        }



        
        const accountNumber = memberResponse.data.accountN;

        
        const loanResponse = await axios.get(`http://localhost:8000/loans/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Loan Data:", loanResponse.data);

       
        const paymentScheduleResponse = await axios.get(`http://localhost:8000/payment-schedules/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("paymentSchedule Data:", paymentScheduleResponse.data);
        
        const paymentResponse = await axios.get(`http://localhost:8000/payments/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("payment Data:", paymentResponse.data);

        
        setMemberData(memberResponse.data);
        setLoanData(loanResponse.data);
        setPaymentSchedules(paymentScheduleResponse.data);
        setPayments(paymentResponse.data);

      } catch (err) {
        setError(err.response?.data?.detail || "Failed to fetch member or loan data.");
      }
    };

    fetchMemberDetails();
  }, []); 

  if (error) {
    return (
      <div className="container">
        <div className="wrapper">
          <p>{error}</p>
          <a href="/" className="button">Go to Login</a>
        </div>
      </div>
    );
  }

  if (!memberData || !loanData || !paymentSchedules || !payments) return <p>Loading...</p>;

  const totalAmountPaid = payments.reduce((acc, payment) => acc + parseFloat(payment.payment_amount || 0), 0);
  const totalInterestDue = paymentSchedules.reduce((acc, schedule) => acc + parseFloat(schedule.interest_due || 0), 0);

  return (
    <div className="container">
      <Topbar />

      <div className="wrapper">
        <section id="welcome">
          <h1>Welcome, {memberData.first_name}!</h1>
        </section>

        <div className="flex-container">
          <section>
            <div className="card">
              <div className="card-header">
                {`${memberData.first_name} ${memberData.last_name}`}
              </div>
              <div className="card-content">
                <p><strong>Account Number:</strong> {memberData.accountN || "N/A"}</p>
                <p><strong>Share Capital:</strong> {memberData.share_capital || "N/A"}</p>
                <div className="card-footer">
                  <div className="item">
                    Regular Loan<br />{loanData.regular_loan_amount || "N/A"}
                  </div>
                  <div className="item">
                    Emergency Loan<br />{loanData.emergency_loan_amount || "N/A"}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="card loan-status">
              <div className="card-header">
                Loan Due on {loanData.due_date || "N/A"}
              </div>
              <div className="card-content">
                <p>{totalAmountPaid || 0}</p>
                <p>Amount Paid</p>
                <p>{loanData.payment_amount} out of {loanData.total_balance || 0}</p>
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{ width: `${loanData.payment_percentage || 0}%` }}
                  ></div>
                </div>
                <p><strong>Interest Rate:</strong> {loanData.interest_rate || "0"}%</p>
                <p><strong>Interest Due:</strong> {totalInterestDue || "N/A"}</p>
                <a href="/ledger" className="button">More</a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
