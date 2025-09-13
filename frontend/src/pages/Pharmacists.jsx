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
        if (Array.isArray(res.data)) {
          setPharmacists(res.data);
        } else {
          setPharmacists([]);
          setError('Invalid response from server.');
        }
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
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="pharmacists-container">
      {pharmacists.length === 0 ? (
        <p>No pharmacists found.</p>
      ) : (
        pharmacists.map((pharmacist) => (
          <PharmacistCard key={pharmacist.userId} pharmacist={pharmacist} />
        ))
      )}
    </div>
  );
}
