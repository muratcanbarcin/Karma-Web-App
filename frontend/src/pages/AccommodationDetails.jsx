import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AccommodationDetails.css";

const AccommodationDetails = () => {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/accommodations/${id}`);
        setDetails(response.data);
      } catch (error) {
        console.error("Failed to fetch details:", error);
      }
    };
    fetchDetails();
  }, [id]);

  if (!details) return <p>Loading...</p>;

  return (
    <div className="details-container">
      <button className="back-button" onClick={() => navigate("/search")}>
        Back to Search
      </button>
      <h1>{details.Location}</h1>
      <img src={details.image || "/105m2_934x700.webp"} alt={details.Location} />
      <h2>{details.DailyPointCost} Points</h2>
      <p>{details.Description}</p>
      <div className="features">
        <p>Bedrooms: {details.bedrooms || "N/A"}</p>
        <p>Bathrooms: {details.bathrooms || "N/A"}</p>
        <p>Size: {details.size || "N/A"} m²</p>
      </div>
    </div>
  );
};

export default AccommodationDetails;
