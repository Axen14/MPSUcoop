// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const MemberPayments = () => {
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPayments = async () => {
//       try {
//         const response = await axios.get('http://127.0.0.1:8000/api/member-payments/', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//           },
//         });
//         setPayments(response.data);
//       } catch (err) {
//         setError('Failed to fetch payments. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPayments();
//   }, []);

//   if (loading) return <p>Loading payments...</p>;
//   if (error) return <p style={{ color: 'red' }}>{error}</p>;

//   return (
//     <div>
//       <h2>My Payments</h2>
//       {payments.length > 0 ? (
//         <table>
//           <thead>
//             <tr>
//               <th>Loan Control Number</th>
//               <th>Due Date</th>
//               <th>Installment Amount</th>
//               <th>Payment Amount</th>
//               <th>Date Paid</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {payments.map((payment) => (
//               <tr key={payment.id}>
//                 <td>{payment.loan.control_number}</td>
//                 <td>{payment.payment_schedule.due_date}</td>
//                 <td>₱ {parseFloat(payment.payment_schedule.installment_amount).toFixed(2)}</td>
//                 <td>₱ {parseFloat(payment.payment_amount).toFixed(2)}</td>
//                 <td>{payment.date_paid ? new Date(payment.date_paid).toLocaleDateString() : 'Not Paid'}</td>
//                 <td>{payment.status}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No payments found.</p>
//       )}
//     </div>
//   );
// };

// export default MemberPayments;
