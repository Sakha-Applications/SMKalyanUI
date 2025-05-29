import React, { useState } from 'react';
import axios from 'axios';
import getBaseUrl from '../../utils/GetUrl';

const CreateAdminUser = () => {
  const [formData, setFormData] = useState({
    profileId: '',
    user_id: '',
    password: '',
    role: 'Admin',
    is_active: 'Yes',
    notes: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post(`${getBaseUrl()}/api/userlogin/create', formData);
      setMessage(response.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error creating user');
    }
  };

  return (
    <div>
      <h2>Create Admin User</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="profileId" placeholder="Profile ID" value={formData.profileId} onChange={handleChange} required />
        <input type="email" name="user_id" placeholder="Email/User ID" value={formData.user_id} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="Role (e.g. Admin)" />
        <input type="text" name="is_active" value={formData.is_active} onChange={handleChange} placeholder="Is Active (Yes/No)" />
        <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Notes (optional)" />
        <button type="submit">Create Admin</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default CreateAdminUser;
