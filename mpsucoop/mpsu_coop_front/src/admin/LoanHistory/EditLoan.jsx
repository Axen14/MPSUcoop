// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';

// const EditLoan = () => {
//     const { controlNumber } = useParams();
//     const history = useNavigate();
//     const [loan, setLoan] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchLoan = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:8000/loans/${controlNumber}/`);
//                 setLoan(response.data);
//                 setLoading(false);
//             } catch (err) {
//                 setError('Error fetching loan details');
//                 setLoading(false);
//             }
//         };
//         fetchLoan();
//     }, [controlNumber]);

//     const handleUpdateLoan = async (e) => {
//         e.preventDefault();
//         try {
//             await axios.put(`http://localhost:8000/loans/${controlNumber}/`, loan);
//             history.push('/loans'); 
//         } catch (err) {
//             setError('Error updating loan');
//         }
//     };

//     if (loading) return <div>Loading loan...</div>;
//     if (error) return <div>{error}</div>;

//     return (
//         <form onSubmit={handleUpdateLoan}>
//             <h3>Edit Loan</h3>
            
//             <div>
//                 <label>Loan Amount:</label>
//                 <input
//                     type="number"
//                     value={loan.loan_amount}
//                     onChange={e => setLoan({ ...loan, loan_amount: e.target.value })}
//                     required
//                 />
//             </div>
//             <button type="submit">Update Loan</button>
//         </form>
//     );
// };

// export default EditLoan;
