import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./SearchForm.css";

const SearchForm = () => {
  const [location, setLocation] = useState("");
  const [minCost, setMinCost] = useState(0);
  const [maxCost, setMaxCost] = useState(2000);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  // Sayfa yüklendiğinde tüm accommodations'ları yükle
  useEffect(() => {
    const fetchAllAccommodations = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/accommodations");
        setResults(response.data);
      } catch (error) {
        console.error("Failed to fetch accommodations:", error);
      }
    };
    fetchAllAccommodations();
  }, []);

  // Arama butonuna tıklandığında filtreleme yap
  const handleSearch = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/accommodations/search", {
        location,
        pointsRange: [minCost, maxCost],
      });
      setResults(response.data);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <div>
      <nav className="menu-bar">
        <img src="/treehouse-1@2x.png" alt="Logo" className="menu-logo" />
        <button className="menu-button" onClick={() => navigate("/")}>
          Go to Home
        </button>
      </nav>
      <div className="search-container">
        <h1>Live Like A Local</h1>
        <div className="search-form">
          <label>
            Location:
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </label>
          <label>
            Min Cost:
            <input
              type="number"
              value={minCost}
              onChange={(e) => setMinCost(Number(e.target.value))}
            />
          </label>
          <label>
            Max Cost:
            <input
              type="number"
              value={maxCost}
              onChange={(e) => setMaxCost(Number(e.target.value))}
            />
          </label>
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="results">
          {results.length > 0 ? (
            <div className="card-container">
              {results.map((item) => (
                <div className="card" key={item.id}>
                  <img src={item.image || "/105m2_934x700.webp"} alt={item.Location} />
                  <div className="card-details">
                    <h2>{item.DailyPointCost} Points</h2>
                    <p>{item.Location}</p>
                    <div className="features">
                      <span>🛏 {item.bedrooms || "N/A"} Bedrooms</span>
                      <span>🛁 {item.bathrooms || "N/A"} Bathrooms</span>
                      <span>📐 {item.size || "N/A"} m²</span>
                    </div>
                    <Link to={`/accommodation-${item.id}`} className="details-button">
                      Details...
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
