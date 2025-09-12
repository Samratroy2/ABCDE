import React, { useEffect, useState } from 'react';  
import axios from 'axios';
import './Profile.css';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [msg, setMsg] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setForm(res.data);
      } catch (err) {
        setMsg(err.response?.data?.message || 'Failed to load profile');
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImageChange = e => setImageFile(e.target.files[0]);

  const handleSubmit = async e => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(form).forEach(key => {
      if (Array.isArray(form[key])) data.append(key, form[key].join(','));
      else if (form[key] !== undefined) data.append(key, form[key]);
    });

    if (imageFile) data.append('image', imageFile);

    try {
      const res = await axios.put('http://localhost:5000/api/users/me', data, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      setProfile(res.data);
      setForm(res.data);
      setEditMode(false);
      setMsg('Profile updated successfully!');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Update failed');
    }
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h1>My Profile</h1>

      {profile.image && (
        <img
          src={profile.image.startsWith('/uploads') ? profile.image : `/uploads/${profile.image}`}
          alt={profile.name}
        />
      )}

      {!editMode ? (
        <div className="profile-details">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>

          {profile.role === 'doctor' && (
            <>
              <p><strong>Specialization:</strong> {profile.specialization || 'N/A'}</p>
              <p><strong>Experience:</strong> {profile.experience || 'N/A'}</p>
              <p><strong>Availability:</strong> {profile.availability?.join(', ') || 'N/A'}</p>
              <p><strong>Patients Served:</strong> {profile.patientsServed || 0}</p>
              <p><strong>Rating:</strong> {profile.rating || 'N/A'}</p>
              <p><strong>Location:</strong> {profile.location || 'N/A'}</p>
              <p><strong>Contact:</strong> {profile.contact || 'N/A'}</p>
            </>
          )}

          {profile.role === 'patient' && (
            <>
              <p><strong>Age:</strong> {profile.age || 'N/A'}</p>
              <p><strong>Medical History:</strong> {profile.medicalHistory?.join(', ') || 'N/A'}</p>
              <p><strong>Location:</strong> {profile.location || 'N/A'}</p>
              <p><strong>Contact:</strong> {profile.contact || 'N/A'}</p>
            </>
          )}

          {profile.role === 'pharmacist' && (
            <>
              <p><strong>Pharmacy Name:</strong> {profile.pharmacyName || 'N/A'}</p>
              <p><strong>License Number:</strong> {profile.licenseNumber || 'N/A'}</p>
              <p><strong>Address:</strong> {profile.address || 'N/A'}</p>
              <p><strong>Location:</strong> {profile.location || 'N/A'}</p>
              <p><strong>Available Medicines:</strong> {profile.medicines?.join(', ') || 'N/A'}</p>
              <p><strong>Availability:</strong> {profile.availability?.join(', ') || 'N/A'}</p>
            </>
          )}

          <button className="edit-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
        </div>
      ) : (
        <form className="profile-form" onSubmit={handleSubmit}>
          <input name="name" value={form.name || ''} onChange={handleChange} placeholder="Name" required />
          <input name="email" value={form.email || ''} onChange={handleChange} placeholder="Email" type="email" required />
          <input type="file" accept="image/*" onChange={handleImageChange} />

          {profile.role === 'doctor' && (
            <>
              <input name="specialization" value={form.specialization || ''} onChange={handleChange} placeholder="Specialization" />
              <input name="experience" value={form.experience || ''} onChange={handleChange} type="number" placeholder="Experience" />
              <input
                name="availability"
                value={form.availability?.join(', ') || ''}
                onChange={e =>
                  setForm({
                    ...form,
                    availability: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  })
                }
                placeholder="Availability (comma separated)"
              />
              <input name="location" value={form.location || ''} onChange={handleChange} placeholder="Location" />
              <input name="contact" value={form.contact || ''} onChange={handleChange} placeholder="Contact" />
              <input name="patientsServed" value={form.patientsServed || ''} onChange={handleChange} type="number" placeholder="Patients Served" />
              <input name="rating" value={form.rating || ''} onChange={handleChange} type="number" placeholder="Rating" />
            </>
          )}

          {profile.role === 'patient' && (
            <>
              <input name="age" value={form.age || ''} onChange={handleChange} type="number" placeholder="Age" />
              <textarea
                name="medicalHistory"
                value={form.medicalHistory?.join(', ') || ''}
                onChange={e =>
                  setForm({
                    ...form,
                    medicalHistory: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  })
                }
                placeholder="Medical History (comma separated)"
              />
              <input name="location" value={form.location || ''} onChange={handleChange} placeholder="Location" />
              <input name="contact" value={form.contact || ''} onChange={handleChange} placeholder="Contact" />
            </>
          )}

          {profile.role === 'pharmacist' && (
            <>
              <input name="pharmacyName" value={form.pharmacyName || ''} onChange={handleChange} placeholder="Pharmacy Name" />
              <input name="licenseNumber" value={form.licenseNumber || ''} onChange={handleChange} placeholder="License Number" />
              <input name="address" value={form.address || ''} onChange={handleChange} placeholder="Address" />
              <input name="location" value={form.location || ''} onChange={handleChange} placeholder="Location" />
              <textarea
                name="medicines"
                value={form.medicines?.join(', ') || ''}
                onChange={e =>
                  setForm({
                    ...form,
                    medicines: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  })
                }
                placeholder="Available Medicines (comma separated)"
              />
              <input
                name="availability"
                value={form.availability?.join(', ') || ''}
                onChange={e =>
                  setForm({
                    ...form,
                    availability: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  })
                }
                placeholder="Availability (comma separated)"
              />
            </>
          )}

          <button type="submit" className="save-btn">Save Changes</button>
          <button type="button" className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
          {msg && <p className={`msg ${msg.includes('success') ? 'success' : 'error'}`}>{msg}</p>}
        </form>
      )}
    </div>
  );
}
