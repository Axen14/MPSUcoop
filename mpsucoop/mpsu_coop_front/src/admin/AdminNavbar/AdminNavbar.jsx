import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faFileInvoiceDollar, faLandmark, faUser, faSignOutAlt, faCalendarAlt,faCog,faFile} from '@fortawesome/free-solid-svg-icons';
import styles from './AdminNavbar.module.css';

const navItems = [
  { icon: faUser, label: 'Members', key: 'members' },
  { icon: faLandmark, label: 'Accounts', key: 'accounts' },
  { icon: faFileInvoiceDollar, label: 'Loans', key: 'loans' },
  { icon: faDollarSign, label: 'Payments', key: 'payments' },
  { icon: faCalendarAlt, label: 'Payment Schedules', key: 'payment-schedules' },
  { icon: faUser, label: 'User Management', key: 'user-management' },
  { icon: faCog, label: 'System Settings', key: 'system-settings' },
  { icon: faFile, label: 'Ledger', key: 'ledger-list' },
];

function AdminNavbar({ onLinkClick }) {
  return (
    <nav className={styles.adminNavbar}>
      <h1 className={styles.logoSystemName}>MPSU EMPLOYEES <br/> CREDIT COOP</h1>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/8bfe72ac8ed57efa94b007072229948a503e6833de11b42732a87835f2ef5650?placeholderIfAbsent=true&apiKey=a955dfffdd554c5782f70fb62e387644"
        alt="Logo"
        className={styles.logoImage}
      />
      <ul className={styles.navList}>
        {navItems.map((item, index) => (
          <li key={index} className={styles.navItem} onClick={() => onLinkClick(item.key)}>
            <FontAwesomeIcon icon={item.icon} className={styles.navIcon} />
            <span className={styles.navLabel}>{item.label}</span>
          </li>
        ))}
      </ul>
      <div className={styles.logOut} onClick={() => console.log('Log out')}>
        <FontAwesomeIcon icon={faSignOutAlt} className={styles.logOutIcon} />
        <span className={styles.logOutText}>Log out</span>
      </div>
    </nav>
  );
}

export default AdminNavbar;
