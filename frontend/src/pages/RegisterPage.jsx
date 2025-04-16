import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';
import '../styles/auth.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    pwd: '',
    pwdConfirm: '',
    phone: '',
    role: 'User' // Default role is User
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  // Validation rules matching backend requirements
  const nameRegex = /^[a-zA-Z]+$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  const validateForm = () => {
    const newErrors = {};
    const { name, email, pwd, pwdConfirm, phone } = formData;

    // Name validation
    if (!name) {
      newErrors.name = 'First and last name are required';
    } else if (!nameRegex.test(name)) {
      newErrors.name = 'Name should only contain letters';
    }

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }

    // Password validation
    if (!pwd) {
      newErrors.pwd = 'Password is required';
    } else if (!pwdRegex.test(pwd)) {
      newErrors.pwd = 'Password must be at least 8 characters and include at least one lowercase letter, one uppercase letter, one digit, and one special character';
    }

    // Password confirmation
    if (pwd !== pwdConfirm) {
      newErrors.pwdConfirm = 'Passwords do not match';
    }

    // Phone is optional but should be validated if provided
    if (phone && !/^\d{10,15}$/.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setServerError('');
    
    // Remove confirmation password before sending to API
    const { pwdConfirm, ...registrationData } = formData;
    
    try {
      await registerUser(registrationData);
      navigate('/login?registered=true'); // Redirect to login with success query param
    } catch (error) {
      console.error('Registration error:', error);
      setServerError(error.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-logo">
          <img src="/logo.png" alt="SmartBuyer" />
        </div>
        
        <h1>Create account</h1>
        
        {serverError && (
          <div className="auth-alert auth-alert-error">
            <div className="auth-alert-icon">!</div>
            <div className="auth-alert-message">
              <span>There was a problem</span>
              <p>{serverError}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Your name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="First and last name"
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Mobile number (optional)</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
              placeholder="Phone number"
            />
            {errors.phone && <p className="error-text">{errors.phone}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="pwd">Password</label>
            <input 
              type="password" 
              id="pwd" 
              name="pwd" 
              value={formData.pwd}
              onChange={handleChange}
              className={errors.pwd ? 'error' : ''}
              placeholder="At least 8 characters"
            />
            {errors.pwd ? (
              <p className="error-text">{errors.pwd}</p>
            ) : (
              <p className="password-hint">
                Passwords must be at least 8 characters and include:
                <br />• Lowercase letters (a-z)
                <br />• Uppercase letters (A-Z)
                <br />• Numbers (0-9)
                <br />• Special characters (e.g., !@#$%)
              </p>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="pwdConfirm">Re-enter password</label>
            <input 
              type="password" 
              id="pwdConfirm" 
              name="pwdConfirm" 
              value={formData.pwdConfirm}
              onChange={handleChange}
              className={errors.pwdConfirm ? 'error' : ''}
            />
            {errors.pwdConfirm && <p className="error-text">{errors.pwdConfirm}</p>}
          </div>
          
          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create your SmartBuyer account'}
          </button>
        </form>
        
        <div className="auth-legal">
          By creating an account, you agree to SmartBuyer's <a href="#">Conditions of Use</a> and <a href="#">Privacy Notice</a>.
        </div>
        
        <div className="auth-divider">
          <span>Already have an account?</span>
        </div>
        
        <Link to="/login" className="auth-secondary-button">
          Sign in to your account
        </Link>
      </div>
      
      <div className="auth-footer">
        <div className="auth-footer-links">
          <a href="#">Conditions of Use</a>
          <a href="#">Privacy Notice</a>
          <a href="#">Help</a>
        </div>
        <div className="auth-copyright">
          © 2025, SmartBuyer.com, Inc. or its affiliates
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;