import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Members.css';
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaSearch } from 'react-icons/fa';  

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [newMember, setNewMember] = useState({});
  const [editingMember, setEditingMember] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');  

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/members/');
        setMembers(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

   
   const filteredMembers = members.filter(member => 
    `${member.first_name} ${member.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.accountN && member.accountN.toString().includes(searchQuery)  
  );

  const handleInputChange = (e, setter) => {
    const { name, value } = e.target;
    setter(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAddMember = async () => {
    if (!newMember.first_name || !newMember.last_name) {
      setFormError('First and last names are required.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/members/', newMember);
      setMembers([...members, response.data]);
      setNewMember({});
      setShowAddForm(false);  
      setFormError(null);
    } catch (err) {
      setFormError('Error adding member. Please try again.');
    }
  };

  const handleDeleteMember = async id => {
    try {
      await axios.delete(`http://localhost:8000/members/${id}/`);
      setMembers(members.filter(member => member.memId !== id));
    } catch (err) {
      setError('Error deleting member.');
    }
  };

  const handleEditMember = async () => {
    if (!editingMember.first_name || !editingMember.last_name) {
      setFormError('First and last names are required.');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/members/${editingMember.memId}/`,
        editingMember
      );
      setMembers(
        members.map(member =>
          member.memId === editingMember.memId ? response.data : member
        )
      );
      setEditingMember(null); 
      setShowAddForm(false);  
      setFormError(null);
    } catch (err) {
      setFormError('Error updating member. Please try again.');
    }
  };

  const handleStartEdit = (member) => {
    setEditingMember({ ...member });  
    setShowAddForm(true);  
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className={styles.membersSection}>
      {showAddForm ? (
        <div className={styles.addMemberForm}>
          <h3>{editingMember ? 'Edit Member' : 'Add Member'}</h3>
          {formError && <p className={styles.errorText}>{formError}</p>}
          <input
            type="text"
            placeholder="First Name"
            name="first_name"
            value={editingMember?.first_name || newMember.first_name || ''}
            onChange={e => handleInputChange(e, editingMember ? setEditingMember : setNewMember)}
          />
          <input
            type="text"
            placeholder="Middle Name"
            name="middle_name"
            value={editingMember?.middle_name || newMember.middle_name || ''}
            onChange={e => handleInputChange(e, editingMember ? setEditingMember : setNewMember)}
          />          
          <input
            type="text"
            placeholder="Last Name"
            name="last_name"
            value={editingMember?.last_name || newMember.last_name || ''}
            onChange={e => handleInputChange(e, editingMember ? setEditingMember : setNewMember)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={editingMember?.email || newMember.email || ''}
            onChange={e => handleInputChange(e, editingMember ? setEditingMember : setNewMember)}
          />
          <input
            type="date"
            placeholder="Birth Date"
            name="birth_date"
            value={editingMember?.birth_date || newMember.birth_date || ''}
            onChange={e => handleInputChange(e, editingMember ? setEditingMember : setNewMember)}
          />
          <input
            type="text"
            placeholder="Phone Number"
            name="phone_number"
            value={editingMember?.phone_number || newMember.phone_number || ''}
            onChange={e => handleInputChange(e, editingMember ? setEditingMember : setNewMember)}
          />
          <input
            type="text"
            placeholder="Religion"
            name="religion"
            value={editingMember?.religion || newMember.religion || ''}
            onChange={e => handleInputChange(e, editingMember ? setEditingMember : setNewMember)}
          />
          <input
            type="text"
            placeholder="Address"
            name="address"
            value={editingMember?.address || newMember.address || ''}
            onChange={e => handleInputChange(e, editingMember ? setEditingMember : setNewMember)}
          />
          <button onClick={editingMember ? handleEditMember : handleAddMember}>
            {editingMember ? 'Save Changes' : 'Submit'}
          </button>
          <button onClick={() => setShowAddForm(false)}>Cancel</button>
        </div>
      ) : (
        <>
          <div className={styles.tableHeader}>
            <h2 className={styles.membersTitle}>MEMBERS</h2>
            <div className={styles.searchBar} style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Search Members"
              title="Only letters and numbers are allowed."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                padding: '7px',
                fontSize: '16px',
                border: '2px solid black',
                borderRadius: '4px',
                width: '260px',
                marginRight: '10px' 
              }}  
            />
            <FaSearch 
              style={{
                position: 'absolute',
                fontSize: '16px', 
                cursor: 'pointer', 
                backgroundColor: '#007bff',
                color: 'black',
                border: 'none',
                borderRadius: '4px',
                padding: '10px',
                marginLeft: '18%'
              }} 
            />
          </div>
            <button
              className={styles.addButton}
              onClick={() => setShowAddForm(true)}
            >
              <AiOutlineUsergroupAdd /> Add Member
            </button>
          </div>

          <table className={styles.membersTable}>
            <thead>
              <tr>
                <th>Account No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map(member => (
                <tr key={member.memId} style={{ textAlign: 'center' }}>
                  <td>{member.accountN || 'No Account'}</td>
                  <td>{member.first_name} {member.last_name}</td>
                  <td>{member.email}</td>
                  <td>{member.phone_number}</td>
                  <td>
                    <button onClick={() => handleStartEdit(member)}><FaEdit /> Edit</button>
                    <button onClick={() => handleDeleteMember(member.memId)}><FaTrash /> Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default Members;
