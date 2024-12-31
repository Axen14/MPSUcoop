// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const LoanManager = () => {
//     const [loans, setLoans] = useState([]);
//     const [loanData, setLoanData] = useState({
//         control_number: '',
//         account: '',
//         loan_amount: '',
//         loan_period: '',
//         loan_period_unit: 'months',
//         loan_type: 'Emergency',
//         purpose: 'Education',
//         status: 'Approved',
//     });
//     const [formVisible, setFormVisible] = useState(false);
//     const [editingLoan, setEditingLoan] = useState(null);
//     const [error, setError] = useState(null);
//     const [paymentFormVisible, setPaymentFormVisible] = useState(false); 
//     const [selectedLoanForPayment, setSelectedLoanForPayment] = useState(null); 
//     const [showPrintButton, setShowPrintButton] = useState(false);
//     const [newLoan, setNewLoan] = useState(null);

//     const BASE_URL = 'http://localhost:8000';

    
//     const fetchLoans = async () => {
//         try {
//             const response = await axios.get(`${BASE_URL}/loans/`);
//             setLoans(response.data);
//         } catch (err) {
//             console.error('Error fetching loans:', err.response || err);
//             setError('Error fetching loans');
//         }
//     };

//     useEffect(() => {
//         fetchLoans(); 
//     }, []);

    
//     const handleLoanSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             let response;
//             if (editingLoan) {
//                 await axios.put(`${BASE_URL}/loans/${editingLoan.control_number}/`, loanData);
//             } else {
//                 response = await axios.post(`${BASE_URL}/loans/`, loanData);
//                 setNewLoan(response.data); 
//                 setShowPrintButton(true);
//             }
//             fetchLoans(); 
//             resetForm(); 
//         } catch (err) {
//             console.error('Error saving loan:', err);
//             setError('Error saving loan');
//         }
//     };

    
//     const handleDeleteLoan = async (controlNumber) => {
//         try {
//             await axios.delete(`${BASE_URL}/loans/${controlNumber}/`);
//             fetchLoans();
//         } catch (err) {
//             console.error('Error deleting loan:', err);
//         }
//     };

    
//     const handleEditLoan = (loan) => {
//         setLoanData(loan);
//         setFormVisible(true);
//         setEditingLoan(loan);
//     };

    
//     const handlePayLoan = (loan) => {
//         setSelectedLoanForPayment(loan);
//         setPaymentFormVisible(true); 
//     };

    
//     const resetForm = () => {
//         setLoanData({
//             control_number: '',
//             account: '',
//             loan_amount: '',
//             loan_period: '',
//             loan_period_unit: 'months',
//             loan_type: 'Emergency',
//             purpose: 'Education',
//             status: 'Approved',
//         });
//         setFormVisible(false);
//         setEditingLoan(null);
//         setShowPrintButton(false); 
//         setNewLoan(null); 
//         setPaymentFormVisible(false); 
//         setSelectedLoanForPayment(null); 
//     };

//     return (
//         <div>
//             <h2>Loan Management</h2>

            
//             {!paymentFormVisible && (
//                 <button onClick={() => setFormVisible(!formVisible)}>
//                     {formVisible ? 'Cancel' : 'Add Loan'}
//                 </button>
//             )}

            
//             {formVisible && !paymentFormVisible && (
//                 <form onSubmit={handleLoanSubmit}>
//                     <h3>{editingLoan ? 'Edit Loan' : 'Create Loan'}</h3>

//                     <label>Account Number:</label>
//                     <input
//                         type="text"
//                         name="account"
//                         value={loanData.account}
//                         onChange={(e) => setLoanData({ ...loanData, account: e.target.value })}
//                         required
//                     />

//                     <label>Loan Amount:</label>
//                     <input
//                         type="number"
//                         name="loan_amount"
//                         value={loanData.loan_amount}
//                         onChange={(e) => setLoanData({ ...loanData, loan_amount: e.target.value })}
//                         required
//                     />

//                     <label>Loan Term:</label>
//                     <input
//                         type="number"
//                         name="loan_period"
//                         value={loanData.loan_period}
//                         onChange={(e) => setLoanData({ ...loanData, loan_period: e.target.value })}
//                         required
//                     />
//                     <label>Loan Term Unit:</label>
//                     <input
//                         name="loan_period_unit"
//                         value={loanData.loan_period_unit}
//                         onChange={(e) => setLoanData({ ...loanData, loan_period_unit: e.target.value })}
//                         required
//                     />

//                     <label>Loan Type:</label>
//                     <select
//                         name="loan_type"
//                         value={loanData.loan_type}
//                         onChange={(e) => setLoanData({ ...loanData, loan_type: e.target.value })}
//                     >
//                         <option value="Regular">Regular</option>
//                         <option value="Emergency">Emergency</option>
//                     </select>

//                     <label>Status:</label>
//                     <select
//                         name="status"
//                         value={loanData.status}
//                         onChange={(e) => setLoanData({ ...loanData, status: e.target.value })}
//                     >
//                         {/* <option value="Approved">Approved</option> */}
//                     </select>

//                     <label>Purpose:</label>
//                     <select
//                         name="purpose"
//                         value={loanData.purpose}
//                         onChange={(e) => setLoanData({ ...loanData, purpose: e.target.value })}
//                     >
//                         <option value="Education">Education</option>
//                         <option value="Medical/Emergency">Medical/Emergency</option>
//                         <option value="House Construction & Repair">House Construction & Repair</option>
//                         <option value="Commodity/Appliances">Commodity/Appliances</option>
//                         <option value="Utility Services">Utility Services</option>
//                         <option value="Others">Others</option>
//                     </select>

//                     <button type="submit">{editingLoan ? 'Update Loan' : 'Create Loan'}</button>
//                     <button type="button" onClick={resetForm}>Clear</button>
//                 </form>
//             )}

            
//             {!formVisible && !paymentFormVisible && (
//                 <>
//                     <h2>Loan List</h2>
//                     {loans.length > 0 ? (
//                         <table>
//                             <thead>
//                                 <tr>
//                                     <th>Account No.</th>
//                                     <th>Amount</th>
//                                     <th>Loan Term</th>
//                                     <th>Loan Term Unit</th>
//                                     <th>Type</th>
//                                     <th>Status</th>
//                                     <th>Purpose</th>
//                                     <th>Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {loans.map((loan) => (
//                                     <tr key={loan.control_number}>
//                                         <td>{loan.account}</td>
//                                         <td>{loan.loan_amount}</td>
//                                         <td>{loan.loan_period}</td>
//                                         <td>{loan.loan_period_unit}</td>
//                                         <td>{loan.loan_type}</td>
//                                         <td>{loan.status}</td>
//                                         <td>{loan.purpose}</td>
//                                         <td>
//                                             <button onClick={() => handleEditLoan(loan)}>Edit</button>
//                                             <button onClick={() => handleDeleteLoan(loan.control_number)}>Delete</button>
//                                             <button onClick={() => handlePayLoan(loan)}>Pay</button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     ) : (
//                         <p>No loans available.</p>
//                     )}
//                 </>
//             )}

           
//             {showPrintButton && newLoan && (
//                 <div>
//                     <p>Loan created successfully!</p>
//                     <button
//                         onClick={() => {
//                             const printContent = `
//                                 <h1>Loan Details</h1>
//                                 <p>Control Number: ${newLoan.control_number}</p>
//                                 <p>Account: ${newLoan.account}</p>
//                                 <p>Amount: ${newLoan.loan_amount}</p>
//                                 <p>Loan Period: ${newLoan.loan_period} ${newLoan.loan_period_unit}</p>
//                                 <p>Type: ${newLoan.loan_type}</p>
//                                 <p>Purpose: ${newLoan.purpose}</p>
//                             `;
//                             const printWindow = window.open('', '_blank');
//                             printWindow.document.write(printContent);
//                             printWindow.document.close();
//                             printWindow.print();
//                         }}
//                     >
//                         Print Loan Details
//                     </button>
//                 </div>
//             )}

            

//         </div>
//     );
// };

// export default LoanManager;
