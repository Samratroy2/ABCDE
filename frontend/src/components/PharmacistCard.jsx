import React from 'react';
import { Link } from 'react-router-dom';
import './PharmacistCard.css';

export default function PharmacistCard({ pharmacist }) {
  // Build full URL if image exists
  let imgSrc = null;
  if (pharmacist.image) {
    if (pharmacist.image.startsWith('http')) {
      imgSrc = pharmacist.image;
    } else if (pharmacist.image.startsWith('/')) {
      imgSrc = `http://localhost:5000${encodeURI(pharmacist.image)}`;
    } else {
      imgSrc = `http://localhost:5000/uploads/${encodeURI(pharmacist.image)}`;
    }
  }

  return (
    <div className="pharmacist-card">
      {imgSrc && (
        <img
          src={imgSrc}
          alt={pharmacist.name || 'Pharmacist'}
          className="pharmacist-card-image"
        />
      )}
      <div className="pharmacist-card-info">
        <h3>{pharmacist.name || 'N/A'}</h3>
        <p><strong>Pharmacy:</strong> {pharmacist.pharmacyName || 'N/A'}</p>
        <p><strong>Location:</strong> {pharmacist.location || 'N/A'}</p>
        <Link to={`/pharmacists/${pharmacist.userId}`} className="view-profile-link">
          View Profile
        </Link>
      </div>
    </div>
  );
}
