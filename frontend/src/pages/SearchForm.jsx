import React, { useState } from "react";
import axios from "axios";
import "./SearchForm.css"; // Yeni bir CSS dosyası oluşturacağız

const SearchForm = () => {
  const [location, setLocation] = useState("");
  const [minCost, setMinCost] = useState(0);
  const [maxCost, setMaxCost] = useState(2000);
  const [results, setResults] = useState([]);

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
    <div className="search-container">
      <h1>LIVE LIKE A LOCAL</h1>
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
                  <p className="description">{item.Description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchForm;
