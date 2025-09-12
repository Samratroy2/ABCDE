//frontend\src\components\DoctorCard.jsx

import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './DoctorCard.css';

export default function DoctorCard({ doctor }) {
  const defaultImage = 'http://localhost:5000/uploads/default-doctor.png';
  const [imgSrc, setImgSrc] = useState(defaultImage);

  useEffect(() => {
    if (!doctor?.image) return;

    const url = doctor.image.startsWith('http')
      ? doctor.image
      : `http://localhost:5000${doctor.image.startsWith('/') ? doctor.image : '/' + doctor.image}`;

    // Preload image to prevent flicker
    const img = new Image();
    img.src = url;
    img.onload = () => setImgSrc(url);
    img.onerror = () => setImgSrc(defaultImage);
  }, [doctor]);

  return (
    <div className="doctor-card">
      <img src={imgSrc} alt={doctor.name || 'Doctor'} className="doctor-card-image" />
      <div className="doctor-card-info">
        <h2>{doctor.name}</h2>
        {doctor.specialization && <p>Specialization: {doctor.specialization}</p>}
        {doctor.experience !== undefined && <p>Experience: {doctor.experience} yrs</p>}
        {doctor.rating !== undefined && <p>Rating: {doctor.rating}</p>}
        <Link to={`/doctors/${doctor.userId}`}>View Details</Link>
      </div>
    </div>
  );
}
