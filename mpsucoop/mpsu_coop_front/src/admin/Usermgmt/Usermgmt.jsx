// import React, { useEffect, useState } from 'react';
// import API from '../api';

// const UserMgmt = () => {
//   const [users, setUsers] = useState([]);
//   const [newPassword, setNewPassword] = useState('');
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await API.get('users/');
//         setUsers(response.data);
//       } catch (err) {
//         console.error('Error fetching users:', err);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const handlePasswordReset = async (id) => {
//     if (!newPassword) {
//       setError('Password cannot be empty');
//       return;
//     }
//     try {
//       const response = await API.post(`users/${id}/reset-password/`, { password: newPassword });
//       setSuccess(response.data.message);
//       setNewPassword('');
//       setSelectedUser(null);
//     } catch (err) {
//       console.error('Error resetting password:', err);
//       setError('Failed to reset password');
//     }
//   };

//   return (
//     <div>
//       <h1>User Management</h1>
//       {error && <p style={{ color: 'red' }}>{error}</p>}
//       {success && <p style={{ color: 'green' }}>{success}</p>}
//       <table>
//         <thead>
//           <tr>
//             <th>Username</th>
//             <th>Email</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user) => (
//             <tr key={user.id}>
//               <td>{user.username}</td>
//               <td>{user.email}</td>
//               <td>
//                 <button onClick={() => setSelectedUser(user.id)}>Reset Password</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       {selectedUser && (
//         <div>
//           <h2>Reset Password for User ID: {selectedUser}</h2>
//           <input
//             type="password"
//             placeholder="Enter new password"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//           />
//           <button onClick={() => handlePasswordReset(selectedUser)}>Submit</button>
//           <button onClick={() => setSelectedUser(null)}>Cancel</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UserMgmt;
