import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './PatientsDetails.css';

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/patients');
        if (Array.isArray(res.data)) {
          setPatients(res.data);
        } else {
          setPatients([]);
          setError('Invalid response from server');
        }
      } catch (err) {
        console.error('Error fetching patients:', err);
        setError('Failed to load patients');
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  if (loading) return <p>Loading patients...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!patients.length) return <p>No patients found.</p>;

  return (
    <div className="patients-page">
      <h1>All Patients</h1>
      <div className="patients-grid">
        {patients.map((patient, index) => {
          // Full URL for backend images
          const imageUrl = patient.image
            ? `http://localhost:5000${encodeURI(patient.image)}`
            : '/default-patient.png';

          return (
            <Link
              to={`/patients/${patient.userId}`}
              key={patient.userId || index}
              className="patient-card"
            >
              <img
                src={imageUrl}
                alt={patient.name || 'Patient'}
                className="patient-card-photo"
              />
              <h3>{patient.name || 'N/A'}</h3>
              <p><strong>Age:</strong> {patient.age || 'N/A'}</p>
              <p><strong>Location:</strong> {patient.location || 'N/A'}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
