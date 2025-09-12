import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import PharmacistCard from "../components/PharmacistCard";
import "./MedicineSearch.css";

export default function MedicineSearch() {
  const [queryParams] = useSearchParams();
  const [query, setQuery] = useState(queryParams.get("name") || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Quick search options (can be fetched from backend later)
  const quickOptions = [
    "Paracetamol",
    "Ibuprofen",
    "Amoxicillin",
    "Cetirizine",
    "Azithromycin",
    "Metformin",
    "Atorvastatin",
    "Amlodipine",
    "Omeprazole",
    "Diclofenac",
  ];

  // Function to call backend search
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) {
      setError("Please enter a medicine name.");
      return;
    }

    setError("");
    setLoading(true);
    setSuggestions([]); // hide suggestions on submit

    try {
      const res = await axios.get(
        `http://localhost:5000/api/pharmacists/search/medicine?name=${encodeURIComponent(query)}`
      );
      setResults(res.data);
    } catch (err) {
      console.error("Error searching medicine:", err);
      setError("Failed to fetch results.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-search if query param exists
  useEffect(() => {
    if (query) handleSearch();
    // eslint-disable-next-line
  }, [query]);

  // Update suggestions as user types
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const filtered = quickOptions.filter((med) =>
      med.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered);
  }, [query]);

  // Handle suggestion click
  const handleQuickSearch = (medicine) => {
    setQuery(medicine);
    setSuggestions([]);
    setTimeout(() => handleSearch(), 0); // trigger search after setting query
  };

  return (
    <div className="medicine-search-container">
      <h2>🔍 Search Medicine Availability</h2>

      <div className="search-box-wrapper">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter medicine name (e.g., Paracetamol)"
            className="search-input"
            autoComplete="off"
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>

        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((med) => (
              <li key={med} onClick={() => handleQuickSearch(med)}>
                {med}
              </li>
            ))}
          </ul>
        )}
      </div>

      {loading && <p>Searching...</p>}
      {error && <p className="error">{error}</p>}

      <div className="pharmacist-results">
        {results.length > 0 ? (
          results.map((pharmacist) => (
            <PharmacistCard
              key={pharmacist.userId}
              pharmacist={pharmacist}
              highlight={query}
            />
          ))
        ) : (
          !loading && query && <p>No pharmacists found stocking "{query}".</p>
        )}
      </div>
    </div>
  );
}
