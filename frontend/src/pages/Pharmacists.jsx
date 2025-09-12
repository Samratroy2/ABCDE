// frontend/src/pages/Pharmacists.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PharmacistCard from '../components/PharmacistCard';
import './Pharmacists.css';

export default function Pharmacists() {
  const [pharmacists, setPharmacists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPharmacists = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/pharmacists');
        setPharmacists(res.data);
      } catch (err) {
        console.error('Error fetching pharmacists:', err);
        setError('Failed to load pharmacists.');
      } finally {
        setLoading(false);
      }
    };
    fetchPharmacists();
  }, []);

  if (loading) return <p>Loading pharmacists...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="pharmacists-container">
      {pharmacists.map((pharmacist) => (
        <PharmacistCard key={pharmacist.userId} pharmacist={pharmacist} />
      ))}
    </div>
  );
}
