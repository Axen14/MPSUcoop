import React, { useState } from 'react';
import AdminNavbar from '../AdminNavbar/AdminNavbar';
import DashboardHeader from '../DashboardHeader/DashboardHeader';
import LoanSummary from '../LoanSummary/LoanSummary';
import Members from '../Members/Members';
import Accounts from '../Accounts/Accounts';
import LoanHistory from '../LoanHistory/LoanHistory';
import styles from './AdminDashboard.module.css';
import PaymentSchedule from '../PaymentSchedule/PaymentSchedule';
import Payments from '../Payments/Payments';
import Settings from '../Settings/SystemSettings';
import Ledger from '../Ledger/Ledger';

function AdminDashboard() {
  const [activeComponent, setActiveComponent] = useState('');


  const renderComponent = () => {
    switch (activeComponent) {
      case 'members':
        return <Members />;
      case 'loanSummary':
        return <LoanSummary />;
      case 'accounts': 
        return <Accounts />;
      case 'loans': 
        return <LoanHistory />;
      case 'payment-schedules': 
        return <PaymentSchedule />;
      case 'payments': 
        return <Payments />;
      case 'ledger-list': 
        return <Ledger />;
      case 'system-settings': 
        return <Settings />;
  
        
      default:
        return (
          <div>
            <LoanSummary />
            <Members />
            
          </div>
        );
    }
  };

  return (
    <div className={styles.adminDashboardContainer}>
      <AdminNavbar onLinkClick={setActiveComponent} />
      
      <main className={styles.adminDashboardMain}>
        
        <DashboardHeader />
        
        
        {renderComponent()}
      </main>
    </div>
  );
}

export default AdminDashboard;