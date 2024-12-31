import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './SystemSettings.css';

const SystemSettings = () => {
    const [settings, setSettings] = useState({
        interest_rate: 0,
        service_fee_rate_emergency: 0,
        penalty_rate: 0,
        service_fee_rate_regular_1yr: 0,
        service_fee_rate_regular_2yr: 0,
        service_fee_rate_regular_3yr: 0,
        service_fee_rate_regular_4yr: 0,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);

    // Fetch current settings on component mount
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/system-settings/')
            .then(response => {
                setSettings(response.data);
            })
            .catch(err => {
                setError('Error fetching system settings.');
                console.error(err);
            });
    }, []);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings({
            ...settings,
            [name]: value,
        });
    };

    // Update system settings
    const handleUpdate = () => {
        axios.put('http://127.0.0.1:8000/api/system-settings/', settings)
            .then(response => {
                setSettings(response.data);
                setIsEditing(false);
            })
            .catch(err => {
                setError('Error updating system settings.');
                console.error(err);
            });
    };

    return (
        <div className={styles.systemSettings}>
            <h2>System Settings</h2>

            {error && <div className="error">{error}</div>}

            <table className={styles.settingsTable}>
                <thead>
                    <tr>
                        <th>Setting</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Interest Rate:</td>
                        <td>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="interest_rate"
                                    value={settings.interest_rate}
                                    onChange={handleChange}
                                />
                            ) : (
                                <span>{settings.interest_rate}%</span>
                            )}
                        </td>
                    </tr>

                    <tr>
                        <td>Emergency Loan Service Fee Rate:</td>
                        <td>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="service_fee_rate_emergency"
                                    value={settings.service_fee_rate_emergency}
                                    onChange={handleChange}
                                />
                            ) : (
                                <span>{settings.service_fee_rate_emergency}%</span>
                            )}
                        </td>
                    </tr>

                    <tr>
                        <td>Penalty Rate:</td>
                        <td>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="penalty_rate"
                                    value={settings.penalty_rate}
                                    onChange={handleChange}
                                />
                            ) : (
                                <span>{settings.penalty_rate}%</span>
                            )}
                        </td>
                    </tr>

                    <tr>
                        <td>Regular Loan Service Fee (&lt;=1 year):</td>
                        <td>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="service_fee_rate_regular_1yr"
                                    value={settings.service_fee_rate_regular_1yr}
                                    onChange={handleChange}
                                />
                            ) : (
                                <span>{settings.service_fee_rate_regular_1yr}%</span>
                            )}
                        </td>
                    </tr>

                    <tr>
                        <td>Regular Loan Service Fee (&lt;=2 years):</td>
                        <td>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="service_fee_rate_regular_2yr"
                                    value={settings.service_fee_rate_regular_2yr}
                                    onChange={handleChange}
                                />
                            ) : (
                                <span>{settings.service_fee_rate_regular_2yr}%</span>
                            )}
                        </td>
                    </tr>

                    <tr>
                        <td>Regular Loan Service Fee (&lt;=3 years):</td>
                        <td>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="service_fee_rate_regular_3yr"
                                    value={settings.service_fee_rate_regular_3yr}
                                    onChange={handleChange}
                                />
                            ) : (
                                <span>{settings.service_fee_rate_regular_3yr}%</span>
                            )}
                        </td>
                    </tr>

                    <tr>
                        <td>Regular Loan Service Fee (&gt;3 years):</td>
                        <td>
                            {isEditing ? (
                                <input
                                    type="number"
                                    name="service_fee_rate_regular_4yr"
                                    value={settings.service_fee_rate_regular_4yr}
                                    onChange={handleChange}
                                />
                            ) : (
                                <span>{settings.service_fee_rate_regular_4yr}%</span>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className="actions">
                {isEditing ? (
                    <button onClick={handleUpdate}>Save Changes</button>
                ) : (
                    <button onClick={() => setIsEditing(true)}>Edit Settings</button>
                )}
            </div>
        </div>
    );
};

export default SystemSettings;
