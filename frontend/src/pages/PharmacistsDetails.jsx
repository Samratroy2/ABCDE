// frontend/src/pages/PharmacistsDetails.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PharmacistsDetails.css';

export default function PharmacistsDetails() {
  const { id } = useParams(); // pharmacist ID
  const navigate = useNavigate();
  const [pharmacist, setPharmacist] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchPharmacist = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/pharmacists/${id}`);
        setPharmacist(res.data);
        setForm(res.data);
      } catch (err) {
        console.error('Error fetching pharmacist details:', err);
        setMsg('Failed to load pharmacist details');
      }
    };
    fetchPharmacist();
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Only allow pharmacist themselves to update
      if (token && pharmacist.userId === JSON.parse(atob(token.split('.')[1])).userId) {
        const data = new FormData();
        data.append('licenseNumber', form.licenseNumber || '');
        data.append('address', form.address || '');
        if (form.image instanceof File) data.append('image', form.image);

        const res = await axios.put('http://localhost:5000/api/users/me', data, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });

        setPharmacist(res.data);
        setForm(res.data);
        setEditMode(false);
        setMsg('Pharmacist details updated successfully!');
      } else {
        setMsg('You are not authorized to edit this pharmacist.');
      }
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.message || 'Update failed');
    }
  };

  if (!pharmacist) return <p>Loading pharmacist details...</p>;

  return (
    <div className="pharmacist-details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      {msg && <p className={`msg ${msg.includes('success') ? 'success' : 'error'}`}>{msg}</p>}

      {!editMode ? (
        <div className="pharmacist-details-card">
          <img
            src={pharmacist.image || '/default-pharma.png'}
            alt={pharmacist.name}
            className="pharmacist-image"
          />
          <h2>{pharmacist.name}</h2>
          <p><strong>Pharmacy Name:</strong> {pharmacist.pharmacyName}</p>
          <p><strong>License Number:</strong> {pharmacist.licenseNumber}</p>
          <p><strong>Email:</strong> {pharmacist.email}</p>
          <p><strong>Location:</strong> {pharmacist.location}</p>
          <p><strong>Address:</strong> {pharmacist.address}</p>
          <p><strong>Medicines Available:</strong></p>
          <ul>
            {pharmacist.medicines?.length > 0 ? (
              pharmacist.medicines.map((med, index) => <li key={index}>{med}</li>)
            ) : (
              <li>No medicines listed</li>
            )}
          </ul>
          {token && pharmacist.userId === JSON.parse(atob(token.split('.')[1])).userId && (
            <button className="edit-btn" onClick={() => setEditMode(true)}>Edit</button>
          )}
        </div>
      ) : (
        <form className="pharmacist-details-card" onSubmit={handleSubmit}>
          <label>License Number</label>
          <input
            name="licenseNumber"
            value={form.licenseNumber || ''}
            onChange={handleChange}
            placeholder="License Number"
          />
          <label>Address</label>
          <input
            name="address"
            value={form.address || ''}
            onChange={handleChange}
            placeholder="Address"
          />
          <label>Profile Image</label>
          <input type="file" accept="image/*" onChange={e => setForm({ ...form, image: e.target.files[0] })} />
          <button type="submit" className="save-btn">Save Changes</button>
          <button type="button" className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
        </form>
      )}
    </div>
  );
}
