import React from 'react';
import styles from './Members.css';

const MembersList = ({ members, setShowFormType }) => {
    return (
        <div className={styles.membersSection}>
            <div className={styles.tableHeader}>
                <h3 className={styles.membersTitle}>Members List</h3>
                <button onClick={() => setShowFormType('add')}>Add Member</button>
            </div>
            <table className={styles.membersTable}>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member, index) => (
                        <tr key={index}>
                            <td>{member.first_name}</td>
                            <td>{member.last_name}</td>
                            <td>{member.email}</td>
                            <td>{member.phone_number}</td>
                            <td>
                                <button onClick={() => setShowFormType('edit')}>Edit</button>
                                <button onClick={() => console.log('Delete', member.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MembersList;



