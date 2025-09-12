// frontend/src/pages/Pharmacists.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PharmacistCard from '../components/PharmacistCard';
import './Pharmacists.css';

export default function Pharmacists() {
  const [pharmacists, setPharmacists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPharmacists = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/pharmacists');
        setPharmacists(res.data);
      } catch (err) {
        console.error('Error fetching pharmacists:', err);
        setError('Failed to load pharmacists');
      } finally {
        setLoading(false);
      }
    };
    fetchPharmacists();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/pharmacists/${id}`);
  };

  if (loading) return <p>Loading pharmacists...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!pharmacists.length) return <p>No pharmacists found.</p>;

  return (
    <div className="pharmacists-page">
      <h1>All Pharmacists</h1>
      <div className="pharmacists-grid">
        {pharmacists.map((pharma) => (
          <PharmacistCard
            key={pharma._id || pharma.email} // unique key fallback
            pharmacist={pharma}
            onClick={() => handleViewDetails(pharma._id)}
          />
        ))}
      </div>
    </div>
  );
}
