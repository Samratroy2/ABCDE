// frontend/src/components/PharmacistCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './PharmacistCard.css';

export default function PharmacistCard({ pharmacist }) {
  return (
    <div className="pharmacist-card">
      <img
        src={pharmacist.image ? `http://localhost:5000${pharmacist.image}` : '/default-avatar.png'}
        alt={pharmacist.name}
        className="pharmacist-image"
      />
      <h3>{pharmacist.name}</h3>
      <p><strong>Pharmacy:</strong> {pharmacist.pharmacyName}</p>
      <p><strong>Location:</strong> {pharmacist.location}</p>
      <Link to={`/pharmacists/${pharmacist.userId}`} className="view-profile-link">
        View Profile
      </Link>
    </div>
  );
}
