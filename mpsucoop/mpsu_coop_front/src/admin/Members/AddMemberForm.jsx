import React, { useState } from 'react';
import styles from './Members.css';

const AddMemberForm = ({ showAddForm, setShowAddForm }) => {
    const [newMember, setNewMember] = useState({});
    const [formError, setFormError] = useState('');

    const handleInputChange = (e, setter) => {
        const { name, value } = e.target;
        setter((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddMember = () => {
        if (!newMember.first_name || !newMember.last_name) {
            setFormError('First Name and Last Name are required');
            return;
        }
        console.log('Member Added:', newMember);
        setFormError('');
        setShowAddForm(false); 
    };

    if (!showAddForm) return null; 

    return (
        <div className={styles.overlay}>
            <div className={styles.formContainer}>
                <h3>Add Member</h3>
                {formError && <p className={styles.errorText}>{formError}</p>}
                <input
                    type="text"
                    placeholder="First Name"
                    name="first_name"
                    value={newMember.first_name || ''}
                    onChange={(e) => handleInputChange(e, setNewMember)}
                />
                <input
                    type="text"
                    placeholder="Middle Name"
                    name="middle_name"
                    value={newMember.middle_name || ''}
                    onChange={(e) => handleInputChange(e, setNewMember)}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    name="last_name"
                    value={newMember.last_name || ''}
                    onChange={(e) => handleInputChange(e, setNewMember)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={newMember.email || ''}
                    onChange={(e) => handleInputChange(e, setNewMember)}
                />
                <input
                    type="date"
                    placeholder="Birth Date"
                    name="birth_date"
                    value={newMember.birth_date || ''}
                    onChange={(e) => handleInputChange(e, setNewMember)}
                />
                <input
                    type="text"
                    placeholder="Phone Number"
                    name="phone_number"
                    value={newMember.phone_number || ''}
                    onChange={(e) => handleInputChange(e, setNewMember)}
                />
                <input
                    type="text"
                    placeholder="Religion"
                    name="religion"
                    value={newMember.religion || ''}
                    onChange={(e) => handleInputChange(e, setNewMember)}
                />
                <input
                    type="text"
                    placeholder="Address"
                    name="address"
                    value={newMember.address || ''}
                    onChange={(e) => handleInputChange(e, setNewMember)}
                />
                <button onClick={handleAddMember}>Submit</button>
                <button onClick={() => setShowAddForm(false)}>Close</button>
            </div>
        </div>
    );
};

export default AddMemberForm;
