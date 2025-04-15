import React from 'react';

const UserProfile = () => {
  const user = {
    name: 'Qiyao Chen',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Boston, MA 02115'
  };

  return (
    <div className="container mt-5">
      <h2>User Profile</h2>
      <div className="card p-3 mt-4 shadow">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Address:</strong> {user.address}</p>
      </div>
    </div>
  );
};

export default UserProfile;
