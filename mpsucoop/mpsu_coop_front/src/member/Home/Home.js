import React, { useEffect, useState } from 'react';
import Topbar from '../Topbar/Topbar';
import './Home.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [memberData, setMemberData] = useState({});
  const [loanData, setLoanData] = useState([]);
  const [paymentSchedules, setPaymentSchedules] = useState([]);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        if (!token) {
          setError("No authentication token found. Please log in again.");
          return;
        }

        const memberResponse = await axios.get('http://localhost:8000/api/member/profile/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const loanResponse = await axios.get('http://localhost:8000/loans', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const paymentScheduleResponse = await axios.get('http://localhost:8000/payment-schedules/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const paymentResponse = await axios.get('http://localhost:8000/payments/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMemberData(memberResponse.data);
        setLoanData(loanResponse.data);
        setPaymentSchedules(paymentScheduleResponse.data);
        setPayments(paymentResponse.data);

      
        console.log("State after setting:");
        console.log("Member Data:", memberResponse.data);
        console.log("Loan Data:", loanResponse.data);
        console.log("Payment Schedules:", paymentScheduleResponse.data);
        console.log("Payments:", paymentResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err.response || err);
        setError(err.response?.data?.detail || "Failed to fetch data.");
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

  if (!memberData || loanData.length === 0 || paymentSchedules.length === 0) {
    return <p>Loading...</p>;
  }

  // Calculate total amount paid from payment schedules where is_paid is True
  const totalAmountPaid = paymentSchedules.reduce((acc, schedule) => {
    if (schedule.is_paid) {
      return acc + parseFloat(schedule.payment_amount || 0);
    }
    return acc;
  }, 0);

  // Sort schedules and find the next due schedule
  const sortedSchedules = [...paymentSchedules].sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  const nextDueSchedule = sortedSchedules.find(schedule => new Date(schedule.due_date) > new Date());

  // Extract relevant details for the next payment schedule
  const loanDueDate = nextDueSchedule ? nextDueSchedule.due_date : "N/A";
  const interestDue = nextDueSchedule ? parseFloat(nextDueSchedule.interest_amount || 0).toFixed(2) : "N/A"; // Interest due from payment schedule
  const amountDue = nextDueSchedule ? parseFloat(nextDueSchedule.payment_amount || 0).toFixed(2) : "N/A"; // Amount due from payment schedule

  // Calculate total balance and progress
  const totalBalance = loanData.reduce((acc, loan) => acc + parseFloat(loan.total_balance || 0), 0);
  const progress = totalBalance > 0 ? (totalAmountPaid / totalBalance) * 100 : 0;

  const toggleMoreOptions = () => {
    setShowMoreOptions(!showMoreOptions);
  };

  const getLoanAmount = (type) => {
    const loan = loanData.find(loan => loan.type === type);
    return loan ? loan.loan_amount : "N/A";
  };

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
                    Regular Loan<br />{getLoanAmount('Regular')}
                  </div>
                  <div className="item">
                    Emergency Loan<br />{getLoanAmount('Emergency')}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="card loan-status">
              <div className="card-header">
                Loan Due on {loanDueDate}
              </div>
              <div className="card-content">
                <p><strong>Amount Paid:</strong> {totalAmountPaid.toFixed(2) || 0}</p>
                <p><strong>Total Balance:</strong> {totalBalance.toFixed(2) || 0}</p>
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p><strong>Interest Rate:</strong> {loanData[0]?.interest_rate || "0"}%</p>
                <p><strong>Interest Due:</strong> {interestDue}</p> 
                <p><strong>Amount Due:</strong> {amountDue}</p> 

                <div className="more-button">
                  <button onClick={toggleMoreOptions}>More</button>
                  {showMoreOptions && (
                    <div className="dropdown-options">
                      <a href="/accounts" className="button">View Ledger</a>
                      <Link to="/loans" className="button">View Schedules</Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
