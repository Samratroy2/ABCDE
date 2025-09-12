// frontend/src/components/PharmacistCard.jsx
import { Link } from 'react-router-dom';
import './PharmacistCard.css';

export default function PharmacistCard({ pharmacist }) {
  return (
    <div className="pharmacist-card">
      <img
        src={pharmacist.image || '/default-pharmacist.png'}
        alt={pharmacist.name}
        className="pharmacist-card-image"
      />
      <div className="pharmacist-card-info">
        <h2 className="pharmacist-card-name">{pharmacist.name}</h2>
        <p><strong>Pharmacy:</strong> {pharmacist.pharmacyName}</p>
        <p><strong>License No:</strong> {pharmacist.licenseNumber}</p>
        <p><strong>Address:</strong> {pharmacist.address}</p>
        <p><strong>Medicines Available:</strong> {pharmacist.medicines?.join(', ') || 'N/A'}</p>
        <Link to={`/pharmacists/${pharmacist._id}`} className="pharmacist-card-link">
          View Profile
        </Link>
      </div>
    </div>
  );
}
