import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-header">
        <Link to="/" className="auth-logo text-center d-block my-4">
          <img src="/logo.png" alt="SmartBuyer" className="img-fluid" style={{maxHeight: '50px'}} />
        </Link>
      </div>
      <div className="auth-content">
        {children}
      </div>
      <div className="auth-footer mt-5">
        <div className="auth-footer-links text-center">
          <a href="#" className="mx-2 text-decoration-none">Conditions of Use</a>
          <a href="#" className="mx-2 text-decoration-none">Privacy Notice</a>
          <a href="#" className="mx-2 text-decoration-none">Help</a>
        </div>
        <div className="auth-copyright text-center mt-2 text-muted">
          © 2025, SmartBuyer.com, Inc. or its affiliates
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;