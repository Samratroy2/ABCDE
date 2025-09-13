import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  // Fetch users
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

  // Delete user
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove from frontend state
      setUsers(users.filter(u => u.userId !== userId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Panel - All Users</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table
          border="1"
          cellPadding="5"
          cellSpacing="0"
          style={{ width: '100%', textAlign: 'center' }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>User ID</th>
              <th>Role</th>
              <th>Gender</th> {/* ✅ Added gender column */}
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
                <td>{u.gender || 'N/A'}</td> {/* ✅ Show gender */}
                <td>
                  {u.image ? (
                    <img
                      src={`http://localhost:5000/uploads/${u.image.split('/').pop()}`}
                      alt="Profile"
                      width="50"
                    />
                  ) : 'N/A'}
                </td>
                <td>
                  <button
                    onClick={() => deleteUser(u.userId)}
                    style={{ backgroundColor: 'red', color: 'white', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
