import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { FaEdit, FaTrash, FaDollarSign, FaSearch } from 'react-icons/fa';

const LoanManager = () => {
    const [loans, setLoans] = useState([]);
    const [loanData, setLoanData] = useState({
        control_number: '',
        account: '',
        loan_amount: '',
        loan_period: '',
        loan_period_unit: 'months',
        loan_type: 'Emergency',
        purpose: 'Education',
        status: 'Pending',
    });
    const [formVisible, setFormVisible] = useState(false);
    const [editingLoan, setEditingLoan] = useState(null);
    const [error, setError] = useState(null);
    const [paymentFormVisible, setPaymentFormVisible] = useState(false);
    const [selectedLoanForPayment, setSelectedLoanForPayment] = useState(null);
    const [showPrintButton, setShowPrintButton] = useState(false);
    const [newLoan, setNewLoan] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [accountName, setAccountName] = useState('');

    const BASE_URL = 'http://localhost:8000';

    const fetchLoans = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/loans/`);
            setLoans(response.data);
            fetchAccountName(response.data);
        } catch (err) {
            console.error('Error fetching loans:', err.response || err);
            setError('Error fetching loans');
        }
    };

    const fetchAccountName = async (loans) => {
        const accountNumber = loans.map(loan => loan.account);
        const uniqueAccountNumber = [...new Set(accountNumber)];  
        const names = {};
        for (let accountNumber of uniqueAccountNumber) {
        try {
            const response = await axios.get(`${BASE_URL}/members/${accountNumber}`);  
        } catch (err) {
            console.error('Error fetching account holder name:', err);
            }
        }
        setAccountName(names);
    };

    useEffect(() => {
        fetchLoans();
    }, []);

    const filteredLoans = loans.filter((loan) =>
        `${loan.account}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        loan.loan_type.toString().includes(searchQuery)
    );

    const handleLoanSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingLoan) {
                await axios.put(`${BASE_URL}/loans/${editingLoan.control_number}/`, loanData);
            } else {
                const response = await axios.post(`${BASE_URL}/loans/`, loanData);
                setNewLoan(response.data);
                setShowPrintButton(true);
                fetchAccountName(response.data);
            }
            fetchLoans();
        } catch (err) {
            console.error('Error saving loan:', err);
            setError('Error saving loan');
        }
    };

    const handleDeleteLoan = async (loan) => {
        if (loan.status !== "Fully Paid") {
            alert("This loan cannot be deleted as it is not fully paid.");
            return;
        }

        const confirmDelete = window.confirm(
            `Are you sure you want to delete the loan with Control Number: ${loan.control_number}? This action cannot be undone.`
        );

        if (!confirmDelete) return;

        try {
            await axios.delete(`${BASE_URL}/loans/${loan.control_number}/`);
            alert("Loan deleted successfully.");
            fetchLoans();
        } catch (err) {
            console.error('Error deleting loan:', err);
            alert(
                `Failed to delete the loan. ${
                    err.response?.data?.message || "Please try again later."
                }`
            );
        }
    };

    const handleEditLoan = (loan) => {
        setLoanData(loan);
        setFormVisible(true);
        setEditingLoan(loan);
    };

    const handlePayLoan = (loan) => {
        setSelectedLoanForPayment(loan);
        setPaymentFormVisible(true);
    };

    const resetForm = () => {
        setLoanData({
            control_number: '',
            account: '',
            loan_amount: '',
            loan_period: '',
            loan_period_unit: 'months',
            loan_type: 'Emergency',
            purpose: 'Education',
            status: 'Pending',
        });
        setFormVisible(false);
        setEditingLoan(null);
        setShowPrintButton(false);
        setNewLoan(null);
        setPaymentFormVisible(false);
        setSelectedLoanForPayment(null);
    };

    return (
        <div className="loan-manager">
            <h2>Loan Management</h2>
            {!formVisible && !paymentFormVisible && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'relative', display: 'inline-block', width: '30%' }}>
                        <input
                            type="text"
                            placeholder="Search Loans"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                padding: '7px 40px 10px 10px',
                                fontSize: '16px',
                                border: '2px solid black',
                                borderRadius: '4px',
                                width: '260px',
                            }}
                        />
                        <button
                            onClick={() => console.log('Search triggered')}
                            style={{
                                position: 'absolute',
                                right: '5px',
                                top: '5%',
                                fontSize: '16px',
                                cursor: 'pointer',
                                backgroundColor: '#007bff',
                                color: 'black',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '10px',
                                marginLeft: '18%',
                            }}
                        >
                            <FaSearch />
                        </button>
                    </div>
                </div>
            )}
            <button onClick={() => setFormVisible(!formVisible)}>
                {formVisible ? 'Cancel' : <><AiOutlineUsergroupAdd /> Add Loan</>}
            </button>

            {formVisible && (
                <form onSubmit={handleLoanSubmit}>
                    <h3>{editingLoan ? 'Edit Loan' : 'Create Loan'}</h3>
                    <input
                        type="text"
                        placeholder="Account Number"
                        value={loanData.account}
                        onChange={(e) => setLoanData({ ...loanData, account: e.target.value })}
                        required
                    />

                    <label>Loan Amount:</label>
                    <input
                        type="number"
                        name="loan_amount"
                        value={loanData.loan_amount}
                        onChange={(e) => setLoanData({ ...loanData, loan_amount: e.target.value })}
                        required
                    />

                    <label>Loan Term:</label>
                    <input
                        type="number"
                        name="loan_period"
                        value={loanData.loan_period}
                        onChange={(e) => setLoanData({ ...loanData, loan_period: e.target.value })}
                        required
                    />
                    <label>Loan Term Unit:</label>
                    <input
                        name="loan_period_unit"
                        value={loanData.loan_period_unit}
                        onChange={(e) => setLoanData({ ...loanData, loan_period_unit: e.target.value })}
                        required
                    />

                    <label>Loan Type:</label>
                    <select
                        name="loan_type"
                        value={loanData.loan_type}
                        onChange={(e) => setLoanData({ ...loanData, loan_type: e.target.value })}
                    >
                        <option value="Regular">Regular</option>
                        <option value="Emergency">Emergency</option>
                    </select>

                    <label>Purpose:</label>
                    <select
                        name="purpose"
                        value={loanData.purpose}
                        onChange={(e) => setLoanData({ ...loanData, purpose: e.target.value })}
                    >
                        <option value="Education">Education</option>
                        <option value="Medical/Emergency">Medical/Emergency</option>
                        <option value="House Construction & Repair">House Construction & Repair</option>
                        <option value="Commodity/Appliances">Commodity/Appliances</option>
                        <option value="Utility Services">Utility Services</option>
                        <option value="Others">Others</option>
                    </select>

                    <button type="submit">{editingLoan ? 'Update Loan' : 'Create Loan'}</button>
                    <button type="button" onClick={resetForm}>Clear</button>
                </form>
            )}

            {!formVisible && !paymentFormVisible && (
                <>
                    <h2>Loan List</h2>
                    {loans.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Account No.</th>
                                    <th>Amount</th>
                                    <th>Loan Term (mos)</th>
                                    <th>Type</th>
                                    <th>Interest (%)</th>
                                    <th>Service Fee</th>
                                    <th>Take Home Pay</th>
                                    <th>Status</th>
                                    <th>Purpose</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLoans.map((loan) => (
                                    <tr key={loan.control_number}>
                                        <td>{loan.account}</td>
                                        <td>{loan.loan_amount}</td>
                                        <td>{loan.loan_period}</td>
                                        <td>{loan.loan_type}</td>
                                        <td>{loan.interest_rate}</td>
                                        <td>{loan.service_fee}</td>
                                        <td>{loan.takehomePay}</td>
                                        <td>{loan.status}</td>
                                        <td>{loan.purpose}</td>
                                        <td>
                                            <button onClick={() => handleEditLoan(loan)}>
                                                <FaEdit />
                                            </button>
                                            <button onClick={() => handleDeleteLoan(loan)}>
                                                <FaTrash />
                                            </button>
                                            <button onClick={() => handlePayLoan(loan)}>
                                                <FaDollarSign />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No loans available.</p>
                    )}
                </>
            )}

            {showPrintButton && newLoan && (
                <div>
                    <p>Loan created successfully!</p>
                    <button
                        onClick={() => {
                            const accountHolderName = accountName[newLoan.account] || "Unknown";
                            const printContent = 
                            `
                                <h1>Loan Details</h1>
                                <p>Control Number: ${newLoan.control_number}</p>
                                <p><strong>Account Holder's Name:</strong> ${accountHolderName}</p>
                                <p>Account: ${newLoan.account}</p>
                                <p>Amount: ${newLoan.loan_amount}</p>
                                <p>Loan Period: ${newLoan.loan_period} ${newLoan.loan_period_unit}</p>
                                <p>Type: ${newLoan.loan_type}</p>
                                <p>Purpose: ${newLoan.purpose}</p>
                            `;
                            const printWindow = window.open('', '_blank');
                            printWindow.document.write(`<html><body>${printContent}</body></html>`);
                            printWindow.document.close();
                            printWindow.print();

                            
                            resetForm();
                        }}
                    >
                        Print Loan Details
                    </button>
                </div>
            )}

        </div>
    );
};

export default LoanManager;
