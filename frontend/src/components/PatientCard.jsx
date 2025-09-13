// frontend/src/components/PatientCard.jsx
import { Link } from 'react-router-dom';
import './PatientCard.css';

export default function PatientCard({ patient }) {
  let imageUrl = null;

  // Only set imageUrl if patient.image exists
  if (patient?.image) {
    // If it starts with http, use as-is
    if (patient.image.startsWith('http')) {
      imageUrl = patient.image;
    } 
    // If it starts with /, append backend base URL
    else if (patient.image.startsWith('/')) {
      imageUrl = `http://localhost:5000${encodeURI(patient.image)}`;
    } 
    // If just a filename, assume it's in /uploads/
    else {
      imageUrl = `http://localhost:5000/uploads/${encodeURI(patient.image)}`;
    }
  }

  return (
    <div className="patient-card">
      {/* Only render img if imageUrl exists */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={patient.name || 'Patient'}
          className="patient-card-image"
        />
      )}
      <div className="patient-card-info">
        <h2 className="patient-card-name">{patient.name || 'N/A'}</h2>
        <p><strong>Age:</strong> {patient.age ?? 'N/A'}</p>
        <p><strong>Location:</strong> {patient.location || 'N/A'}</p>
        <p><strong>Contact:</strong> {patient.contact || 'N/A'}</p>
        <p><strong>Medical History:</strong> {patient.medicalHistory?.join(', ') || 'N/A'}</p>
        <Link to={`/patients/${patient.userId}`} className="patient-card-link">
          View Profile
        </Link>
      </div>
    </div>
  );
}
