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
  const [points, setPoints] = useState(null); // Points bilgisini tutuyoruz

  const navigate = useNavigate();

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
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Eğer token varsa, points bilgisi çekilir
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
          setPoints(data.pointsBalance); // Points bilgisini state'e kaydet
        })
        .catch((error) => {
          console.error("Error fetching points balance:", error);
        });
    }
  }, []);

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
                    {/* Kullanıcı giriş yapmışsa points'i göster */}
                    {points !== null && (
                      <div className={styles.button}>
                        {`Points: ${points}`}
                      </div>
                    )}
          </div>

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
