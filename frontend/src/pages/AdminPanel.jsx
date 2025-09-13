import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminPanel.css'; // import CSS

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        setError('You are not logged in');
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        if (err.response?.status === 403) {
          setError('Access denied. Only super admin can view users.');
        } else {
          setError(err.response?.data?.message || 'Failed to load users');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter(u => u.userId !== userId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) return <p className="admin-panel-loading">Loading users...</p>;
  if (error) return <p className="admin-panel-error">{error}</p>;

  return (
    <div className="admin-panel-container">
      <h1>Admin Panel - All Users</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="admin-panel-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>User ID</th>
                <th>Role</th>
                <th>Gender</th>
                <th>Profile Photo</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.userId}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.userId}</td>
                  <td>{u.role}</td>
                  <td>{u.gender || 'N/A'}</td>
                  <td>
                    {u.image ? (
                      <img
                        src={`http://localhost:5000/uploads/${u.image.split('/').pop()}`}
                        alt="Profile"
                      />
                    ) : 'N/A'}
                  </td>
                  <td>
                    <button onClick={() => deleteUser(u.userId)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
