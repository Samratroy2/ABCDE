// frontend/src/pages/PharmacistsDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './PharmacistsDetails.css';

export default function PharmacistsDetails() {
  const { userId } = useParams(); // must match :userId in App.jsx
  const [pharmacist, setPharmacist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPharmacist = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/pharmacists/${userId}`);
        setPharmacist(res.data);
      } catch (err) {
        console.error('Error fetching pharmacist details:', err);
        setError('Pharmacist not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchPharmacist();
  }, [userId]);

  if (loading) return <p>Loading pharmacist details...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!pharmacist) return null;

  // Only show image if present in backend data
  let photoUrl = null;
  if (pharmacist.image) {
    if (pharmacist.image.startsWith('http')) {
      photoUrl = pharmacist.image;
    } else if (pharmacist.image.startsWith('/')) {
      photoUrl = `http://localhost:5000${encodeURI(pharmacist.image)}`;
    } else {
      photoUrl = `http://localhost:5000/uploads/${encodeURI(pharmacist.image)}`;
    }
  }

  return (
    <div className="pharmacist-details">
      {photoUrl && (
        <img
          src={photoUrl}
          alt={pharmacist.name}
          className="pharmacist-details-image"
        />
      )}
      <h2>{pharmacist.name}</h2>
      <p><strong>Email:</strong> {pharmacist.email}</p>
      <p><strong>Pharmacy:</strong> {pharmacist.pharmacyName || 'N/A'}</p>
      <p><strong>License No:</strong> {pharmacist.licenseNumber || 'N/A'}</p>
      <p><strong>Location:</strong> {pharmacist.location || 'N/A'}</p>
      <p><strong>Address:</strong> {pharmacist.address || 'N/A'}</p>
      <p><strong>Medicines:</strong> {pharmacist.medicines?.length > 0 ? pharmacist.medicines.join(', ') : 'N/A'}</p>
      {pharmacist.availability?.length > 0 && (
        <p><strong>Availability:</strong> {pharmacist.availability.join(', ')}</p>
      )}
    </div>
  );
}
