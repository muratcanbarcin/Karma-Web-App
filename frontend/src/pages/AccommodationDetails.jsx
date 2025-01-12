import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AccommodationDetails.css";

const AccommodationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accommodation, setAccommodation] = useState(null);

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/accommodations/${id}`);
        setAccommodation(response.data);
      } catch (error) {
        console.error("Failed to fetch accommodation details:", error);
      }
    };

    fetchAccommodation();
  }, [id]);

  if (!accommodation) {
    return <p>Loading...</p>;
  }

  const formattedDates = Array.isArray(accommodation.AvailableDates)
    ? accommodation.AvailableDates.join(", ")
    : "No dates available";

  return (
    <div className="details-container">
      <button className="back-button" onClick={() => navigate("/search")}>
        Back to Search
      </button>
      <h1>{accommodation.Title}</h1>
      <img
        src={accommodation.image || "/105m2_934x700.webp"}
        alt={accommodation.Title}
        className="details-image"
      />
      <h2>{accommodation.DailyPointCost} Points</h2>
      <p>{accommodation.Description}</p>
      <div>
        <h3>Location</h3>
        <p>{accommodation.Location}</p>
      </div>
      <div>
        <h3>Amenities</h3>
        <pre>{JSON.stringify(accommodation.Amenities, null, 2)}</pre>
      </div>
      <div>
        <h3>House Rules</h3>
        <pre>{JSON.stringify(accommodation.HouseRules, null, 2)}</pre>
      </div>
      <div>
        <h3>Available Dates</h3>
        <p>{formattedDates}</p>
      </div>
    </div>
  );
};

export default AccommodationDetails;