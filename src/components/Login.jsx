import React, { useState } from 'react';
import '../styles/login.css';
import apiService from '../apiService';

console.log(' Login.jsx loaded, apiService is:', typeof apiService);
console.log(' apiService.login is:', typeof apiService?.login);

function Login({ onLoginSuccess }) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    console.log(' Login form submitted');
    console.log('Credentials:', credentials.username);
    console.log('Calling apiService.login...');

    try {
      const data = await apiService.login(credentials);
      
      console.log('Storing token in localStorage...');
      console.log('Token to store:', data.token?.substring(0, 20) + '...');
      
      // Store token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      console.log(' Token stored successfully');
      console.log('Verifying localStorage...');
      console.log('Token in storage:', localStorage.getItem('token')?.substring(0, 20) + '...');
      console.log('User in storage:', localStorage.getItem('user'));
      
      // Call success callback
      console.log('Calling onLoginSuccess callback...');
      onLoginSuccess(data);
      
    } catch (error) {
      console.error(' Login error:', error);
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">
            <span className="logo-icon">🏥</span>
            <h1>HospitalDash</h1>
          </div>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p className="demo-credentials">
            <strong>Demo Credentials:</strong><br />
            Username: <code>admin</code><br />
            Password: <code>admin123</code>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;