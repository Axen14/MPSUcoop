import React, { useState, useEffect } from 'react';
import styles from './DashboardHeader.css';


function DashboardHeader() {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000); 

    return () => clearInterval(intervalId);   

  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };


  return (
    <div className=" backg" styles={{position:"sticky"}}>
      <header >
        <div><h2 className={styles.welcomeAdmin}>WELCOME, ADMIN</h2></div>
        <div className={styles.searchContainer}>
          <label htmlFor="searchInput" className="visually-hidden"></label>
      </div>
      <div className={styles.dateDisplay}>
      {formatDate(currentDate)}
      </div>
    </header>
    </div>
    
    
  );
}

export default DashboardHeader;