import React, { useState } from 'react';
import styles from './Accounts.css';
import { FaPlus, FaEye, FaEdit } from 'react-icons/fa';
import AddMemberForm from '../Members/AddMemberForm'; 

function AddAccountForm({ onClose, onAddAccount, members, fetchMembers }) {
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [shareCapital, setShareCapital] = useState('');
  const [status, setStatus] = useState('Active');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAccount = {
      account_number: accountNumber,
      account_holder: selectedMemberId,
      shareCapital: parseFloat(shareCapital),
      status: status,
    };
    onAddAccount(newAccount);
    onClose();
  };

  
  const openAddMemberWindow = () => {
    const newWindow = window.open(
      '/popup.html',
      '_blank',
      'width=600,height=400,left=200,top=200'  
    );

    newWindow.onload = () => {
      newWindow.document.title = 'Add Member';
    };
    newWindow.document.body.style.padding = '20px';
    newWindow.document.body.style.fontFamily = 'Arial, sans-serif';
  };
  const openEditMemberWindow = () => {
  };
  const openViewMemberWindow = () => {
  };


  return (
    <div className={styles.formContainer}>
      <h3>Add New Account</h3>
      <form onSubmit={handleSubmit}>
        <label>Account Number:</label>
        <input
          type="text"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          required
        />

        <label>Account Holder:</label>
        <div className={styles.accountHolderInput}>
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
          >
            <option value="">Select Member</option>
            {members.map((member) => (
              <option key={member.memId} value={member.memId}>
                {`${member.first_name} ${member.last_name}`}
              </option>
            ))}
          </select>
          <FaPlus onClick={openAddMemberWindow} title="Add Member" />
          <FaEye onClick={openViewMemberWindow} title="View Member" />
          <FaEdit onClick={openEditMemberWindow} title="Edit Member" />
        </div>

        <label>Share Capital:</label>
        <input
          type="number"
          value={shareCapital}
          onChange={(e) => setShareCapital(e.target.value)}
          required
        />

        <label>Status:</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button type="submit">Add Account</button>
        <button type="button" onClick={onClose}>Close</button>
      </form>
    </div>
  );
}

export default AddAccountForm;
