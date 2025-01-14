import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SearchForm.css";
import styles from "./Karmaacom.module.css";

const SearchForm = () => {
  const [location, setLocation] = useState("");
  const [minCost, setMinCost] = useState(0);
  const [maxCost, setMaxCost] = useState(2000);
  const [results, setResults] = useState([]);
  const [points, setPoints] = useState(null);

  const navigate = useNavigate();

  // Handle changes for min cost input
  const handleMinCostChange = (e) => {
    const value = e.target.value;
    setMinCost(value.length > 1 && value.startsWith("0") ? value.substring(1) : value);
  };

  // Handle changes for max cost input
  const handleMaxCostChange = (e) => {
    const value = e.target.value;
    setMaxCost(value.length > 1 && value.startsWith("0") ? value.substring(1) : value);
  };

  // Fetch all accommodations on mount
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

  // Fetch user points if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3000/api/users/points", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch points.");
          }
          return response.json();
        })
        .then((data) => {
          setPoints(data.pointsBalance);
        })
        .catch((error) => {
          console.error("Error fetching points balance:", error);
        });
    }
  }, []);

  // Handle search action
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
        <div className="menu-button">
          {points !== null && <div className={styles.button}>{`Points: ${points}`}</div>}
        </div>
        <button className="menu-button" onClick={() => navigate("/")}>Go to Home</button>
      </nav>
      <div className="search-container">
        <h1 className="search-title">Find Your Perfect Stay</h1>
        <div className="search-form">
          <label htmlFor="location">
            Location
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter a location..."
            />
          </label>
          <label htmlFor="min-cost">
            Min Cost
            <input
              id="min-cost"
              type="number"
              value={minCost}
              onChange={handleMinCostChange}
              placeholder="Min cost..."
            />
          </label>
          <label htmlFor="max-cost">
            Max Cost
            <input
              id="max-cost"
              type="number"
              value={maxCost}
              onChange={handleMaxCostChange}
              placeholder="Max cost..."
            />
          </label>
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="results">
          {results.length > 0 ? (
            <div className="card-container">
              {results.map((item) => (
                <div className="card" key={item.AccommodationID}>
                  <img src={item.image || "/105m2_934x700.webp"} alt={item.Location} />
                  <div className="card-details">
                    <h2>{item.DailyPointCost} Points</h2>
                    <p>{item.Location}</p>
                    <p className="description">{item.Description}</p>
                    <button
                      onClick={() => navigate(`/accommodation/${item.AccommodationID}`)}
                      className="details-button"
                    >
                      Details...
                    </button>
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
