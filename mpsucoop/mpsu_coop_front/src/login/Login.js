import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './login.css';

function Login() {
  const [account_number, setaccount_number] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    setError('');
  };

  const handleBackToRoleSelection = () => {
    setRole('');
    setShowSignup(false);
    setError('');
    setaccount_number('');
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const handleMemberLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const credentials = { account_number, password };

    try {
      const response = await fetch('http://localhost:8000/login/member/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('account_number', data.accountN);
      localStorage.setItem('userRole', 'member');  
      console.log('Member login successful');
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const credentials = { username, password };

    try {
      const response = await fetch('http://localhost:8000/login/admin/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('userRole', 'admin');  
      console.log('Admin login successful');
      navigate('/admin-dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Signup/Register 
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const signupData = {
      account_number,
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:8000/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Signup failed');
      }

      console.log('Signup successful');
      setShowSignup(false);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lcontainer">
      <div className="background"></div>
      <div className="login-box">
        <div className="login-container">
          <h1>MPSU Employees Credit Cooperative</h1>
          {!showSignup && !role ? (
            <div className="role-selection">
              <p>Who is signing in?</p>
              <button onClick={() => handleRoleSelection('member')} className="btn btn-primary">
                Member
              </button>
              <button onClick={() => handleRoleSelection('admin')} className="btn btn-secondary">
                Admin
              </button>
            </div>
          ) : showSignup ? (
            <form onSubmit={handleSignupSubmit} className="form">
              <input
                type="text"
                className="form-control"
                placeholder="Account Number"
                value={account_number}
                onChange={(e) => setaccount_number(e.target.value)}
                required
              />
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <div className="alert alert-danger">{error}</div>}
              <button type="submit" className="btn btn-primary">
                {loading ? 'Signing up...' : 'Sign up'}
              </button>
              <button onClick={handleBackToRoleSelection} className="btn btn-secondary">
                Back
              </button>
            </form>
          ) : role === 'member' ? (
            <form onSubmit={handleMemberLoginSubmit} className="form">
              <input
                type="text"
                className="form-control"
                placeholder="Account Number"
                value={account_number}
                onChange={(e) => setaccount_number(e.target.value)}
                required
              />
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <div className="alert alert-danger">{error}</div>}
              <button type="submit" className="btn btn-primary">
                {loading ? 'Logging in...' : 'Log in'}
              </button>
              <button onClick={handleBackToRoleSelection} className="btn btn-secondary">
                Back
              </button>
              <p>
                Don't have an account?{' '}
                <a href="#" onClick={() => setShowSignup(true)}>Create an Account</a>
              </p>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit}>
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <div className="alert alert-danger">{error}</div>}
              <button type="submit" className="btn btn-secondary">
                {loading ? 'Logging in...' : 'Log in'}
              </button>
              <button onClick={handleBackToRoleSelection} className="btn btn-secondary">
                Back
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;