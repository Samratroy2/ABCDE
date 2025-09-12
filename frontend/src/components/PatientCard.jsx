// frontend/src/components/PatientCard.jsx

import { Link } from 'react-router-dom';
import './PatientCard.css';

export default function PatientCard({ patient }) {
  return (
    <div className="patient-card">
      <img
        src={patient.image ? patient.image : '/default-patient.png'}
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
