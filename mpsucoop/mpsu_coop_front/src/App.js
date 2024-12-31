import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './admin/AdminDashboard/AdminDashboard';
import Home from './member/Home/Home';
import Login from './login/Login';
import Loans from './member/Loans/Loans'; 
import PaymentSchedule from './member/PaymentSchedule'; 
import Payments from './member/Payments'; 
import Accounts from './member/Account/Account'; 
import Ledger from './member/Ledger/Ledger'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Public/General Routes */}
        <Route path="/" element={<Login />} />
        
        {/* this is for the admin only */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        
        {/* Members or individual*/}
        <Route path="/home" element={<Home />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/payment-schedules/:control_number" element={<PaymentSchedule />} /> 
          <Route path="api/payments/:control_number" element={<Payments />} />
          <Route path="/accounts" element={<Accounts />} /> 
          <Route path="/ledger" element={<Ledger />} /> 
        
      </Routes>
    </Router>
  );
}

export default App;