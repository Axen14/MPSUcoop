import React, { useEffect, useState } from 'react';
import './LoanSummary.css';

function LoanSummary() {
  const [loanSummaryData, setLoanSummaryData] = useState({
    borrowers: { active: 0, paidOff: 0 },
    netTotalLoan: { returned: 0, profit: 0, serviceFees: 0, penalties: 0 },
    loans: { ongoing: 0, completed: 0, pending: 0 },
    paymentSchedules: 0,
    totalLoansCount: 0,
    totalPaymentsCount: 0,
  });

  useEffect(() => {
    const fetchLoanSummary = async () => {
      try {
        const response = await fetch('/api/loan-summary/'); 
        const data = await response.json();
        setLoanSummaryData(data);  
      } catch (error) {
        console.error('Error fetching loan summary data:', error);
      }
    };

    fetchLoanSummary();
  }, []);

  return (
    <div className="loan-summary-container">

     
      <div className="loan-card">
        <h3 className="loans-type">BORROWERS</h3>
        <p className="loan-amount">{loanSummaryData.borrowers.active + loanSummaryData.borrowers.paidOff}</p>
        <div className="loan-details">
          <span className="loan-label">Active: {loanSummaryData.borrowers.active}</span>
          <span className="loan-label">Paid-off: {loanSummaryData.borrowers.paidOff}</span>
        </div>
      </div>

      
      <div className="loan-card">
        <h3 className="loans-type">NET TOTAL LOAN AMOUNT</h3>
        <p className="loan-amount">{loanSummaryData.netTotalLoan.returned + loanSummaryData.netTotalLoan.profit}</p>
        <div className="loan-details">
          {/* <span className="loan-label">Received: {loanSummaryData.netTotalLoan.received}</span> */}
          <span className="loan-label">Returned: {loanSummaryData.netTotalLoan.returned}</span>
          <span className="loan-label">Profit: {loanSummaryData.netTotalLoan.profit}</span>
          {/* <span className="loan-label">Service Fees: {loanSummaryData.netTotalLoan.serviceFees}</span>
          <span className="loan-label">Penalties: {loanSummaryData.netTotalLoan.penalties}</span> */}
        </div>
      </div>

      
      <div className="loan-card">
        <h3 className="loans-type">LOANS</h3>
        <p className="loan-amount">{loanSummaryData.loans.ongoing + loanSummaryData.loans.completed}</p>
        <div className="loan-details">
          <span className="loan-label">Ongoing: {loanSummaryData.loans.ongoing}</span>
          <span className="loan-label">Completed: {loanSummaryData.loans.completed}</span>
          {/* <span className="loan-label">Pending: {loanSummaryData.loans.pending}</span> */}
        </div>
      </div>
    </div>
  );
}

export default LoanSummary;
