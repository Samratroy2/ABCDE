import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './DoctorDetail.css';

export default function DoctorDetail() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imgSrc, setImgSrc] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/doctors/${id}`);
        setDoctor(res.data);

        const url = res.data.image
          ? res.data.image.startsWith('http')
            ? res.data.image
            : `http://localhost:5000${res.data.image.startsWith('/') ? res.data.image : '/' + res.data.image}`
          : 'http://localhost:5000/uploads/default-doctor.png';

        // Preload image
        const img = new Image();
        img.src = url;
        img.onload = () => setImgSrc(url);
        img.onerror = () => setImgSrc('http://localhost:5000/uploads/default-doctor.png');
      } catch (err) {
        console.error(err);
        setError('Failed to load doctor details');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) return <p>Loading doctor details...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!doctor) return <p>Doctor not found.</p>;

  return (
    <div className="doctor-details-page">
      <Link to="/doctors">← Back to Doctors</Link>
      <h1>{doctor.name}</h1>
      <div className="doctor-info">
        <img src={imgSrc} alt={doctor.name || 'Doctor'} className="doctor-photo" />
        <p><strong>User ID:</strong> {doctor.userId}</p>
        <p><strong>Email:</strong> {doctor.email}</p>
        <p><strong>Role:</strong> {doctor.role}</p>
        <p><strong>Contact:</strong> {doctor.contact || 'N/A'}</p>
        <p><strong>Location:</strong> {doctor.location || 'N/A'}</p>
        <p><strong>Specialization:</strong> {doctor.specialization || 'N/A'}</p>
        <p><strong>Experience:</strong> {doctor.experience || 'N/A'} years</p>
        <p><strong>Patients Served:</strong> {doctor.patientsServed || 0}</p>
        <p><strong>Rating:</strong> {doctor.rating || 'N/A'}</p>
        <p><strong>Availability:</strong> {doctor.availability?.join(', ') || 'N/A'}</p>
      </div>
    </div>
  );
}
