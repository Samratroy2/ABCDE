import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './Patients.css';

export default function PatientsDetails() {
  const { id } = useParams(); // userId from URL
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('Invalid patient ID');
      setLoading(false);
      return;
    }

    const fetchPatient = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/patients/${id}`);
        setPatient(res.data);
      } catch (err) {
        console.error('Error fetching patient:', err);
        setError('Failed to load patient details');
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading) return <p>Loading patient details...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!patient) return <p>Patient not found.</p>;

  const photoUrl = patient.image
    ? `http://localhost:5000${patient.image}`
    : '/default-patient.png';

  return (
    <div className="patient-details-page">
      <Link to="/patients" className="back-link">← Back to Patients</Link>
      <h1>{patient.name}</h1>
      <div className="patient-info">
        <p><strong>User ID:</strong> {patient.userId}</p>
        <p><strong>Email:</strong> {patient.email}</p>
        <p><strong>Role:</strong> {patient.role}</p>
        <p><strong>Contact:</strong> {patient.contact || 'N/A'}</p>
        <p><strong>Location:</strong> {patient.location || 'N/A'}</p>
        <p><strong>Profile Photo:</strong></p>
        <img
          src={photoUrl}
          alt={patient.name}
          className="patient-photo"
          onError={(e) => (e.target.src = '/default-patient.png')}
        />
        {patient.medicalHistory?.length > 0 && (
          <div>
            <strong>Medical History:</strong>
            <ul>
              {patient.medicalHistory.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
