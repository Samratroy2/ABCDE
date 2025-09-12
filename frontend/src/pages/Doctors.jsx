// frontend\src\pages\Doctors.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import DoctorCard from '../components/DoctorCard';
import './Doctors.css';

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/doctors');
        if (Array.isArray(res.data)) {
          setDoctors(res.data);
        } else {
          setDoctors([]);
          setError('Invalid response from server');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  if (loading) return <p>Loading doctors...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!doctors.length) return <p>No doctors found.</p>;

  return (
    <div className="doctors-page">
      <h1>All Doctors</h1>
      <div className="doctors-grid">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.userId} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}
