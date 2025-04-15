import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState({
    name: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    // Fetch user profile (mocked for now)
    setUser({
      name: 'Peter Chen',
      phone: '123-456-7890',
      address: '123 Example St, Boston, MA'
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      // Send update request (replace with your API)
      await axios.put('/api/user/update', {
        phone: user.phone,
        address: user.address
      });
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Update failed.');
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2>User Profile</h2>
      <div className="mb-3">
        <label className="form-label">Name</label>
        <input className="form-control" value={user.name} disabled />
      </div>
      <div className="mb-3">
        <label className="form-label">Phone</label>
        <input
          className="form-control"
          name="phone"
          value={user.phone}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Address</label>
        <input
          className="form-control"
          name="address"
          value={user.address}
          onChange={handleChange}
        />
      </div>
      <button className="btn btn-primary" onClick={handleUpdate}>
        Update
      </button>
    </div>
  );
};

export default UserProfile;
