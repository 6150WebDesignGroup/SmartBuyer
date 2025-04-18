import React from 'react';
import AdminNavbar from './AdminNavBar';

const AdminLayout = ({ currentUser, handleLogout, children }) => {
  return (
    <>
      <AdminNavbar currentUser={currentUser} handleLogout={handleLogout} />
      <main className="container mt-4">
        {children}
      </main>
    </>
  );
};

export default AdminLayout;
