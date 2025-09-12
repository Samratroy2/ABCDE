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
  if (error) return <p>{error}</p>;
  if (!pharmacist) return null;

  return (
    <div className="pharmacist-details">
      <img
        src={pharmacist.image ? `http://localhost:5000${pharmacist.image}` : '/default-avatar.png'}
        alt={pharmacist.name}
        className="pharmacist-details-image"
      />
      <h2>{pharmacist.name}</h2>
      <p><strong>Email:</strong> {pharmacist.email}</p>
      <p><strong>Pharmacy:</strong> {pharmacist.pharmacyName}</p>
      <p><strong>License No:</strong> {pharmacist.licenseNumber}</p>
      <p><strong>Location:</strong> {pharmacist.location}</p>
      <p><strong>Address:</strong> {pharmacist.address}</p>
      <p><strong>Medicines:</strong> {pharmacist.medicines.join(', ')}</p>
      {pharmacist.availability && pharmacist.availability.length > 0 && (
        <p><strong>Availability:</strong> {pharmacist.availability.join(', ')}</p>
      )}
    </div>
  );
}
