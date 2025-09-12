// frontend/src/components/PatientCard.jsx
import { Link } from 'react-router-dom';
import './PatientCard.css';

export default function PatientCard({ patient }) {
  // Full URL for backend images
  const imageUrl = patient.image
    ? `http://localhost:5000${encodeURI(patient.image)}`
    : '/default-patient.png';

  return (
    <div className="patient-card">
      <img
        src={imageUrl}
        alt={patient.name}
        className="patient-card-image"
      />
      <div className="patient-card-info">
        <h2 className="patient-card-name">{patient.name}</h2>
        <p><strong>Age:</strong> {patient.age || 'N/A'}</p>
        <p><strong>Medical History:</strong> {patient.medicalHistory?.join(', ') || 'N/A'}</p>
        <Link to={`/patients/${patient.userId}`} className="patient-card-link">
          View Profile
        </Link>
      </div>
    </div>
  );
}
