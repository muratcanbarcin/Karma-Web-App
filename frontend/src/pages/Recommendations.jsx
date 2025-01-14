import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Recommendations.css";

const Recommendations = () => {
  const [accommodations, setAccommodations] = useState([]);
  const navigate = useNavigate();

  // Fetch random recommendations on component mount
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/accommodations/random?limit=8");
        if (!response.ok) {
          throw new Error("Failed to fetch recommendations");
        }
        const data = await response.json();
        setAccommodations(data);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setAccommodations([]);
      }
    };

    fetchRecommendations();
  }, []);

  // Navigate to accommodation details page
  const handleCardClick = (id) => {
    navigate(`/accommodation/${id}`);
  };

  return (
    <div className="recommendations-container">
      <h1>Home Recommendations For You</h1>
      <div className="recommendations-grid">
        {accommodations.map((accommodation) => (
          <div
            key={accommodation.AccommodationID}
            className="recommendation-card"
            onClick={() => handleCardClick(accommodation.AccommodationID)}
          >
            <img
              src={accommodation.image}
              alt={accommodation.Title}
              className="recommendation-image"
            />
            <div className="recommendation-details">
              <h2 className="recommendation-title">{accommodation.Title}</h2>
              <p className="recommendation-location">{accommodation.Location}</p>
              <p className="recommendation-points">{accommodation.DailyPointCost} Points</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
