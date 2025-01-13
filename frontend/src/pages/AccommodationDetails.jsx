import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AccommodationDetails.css";

const AccommodationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accommodation, setAccommodation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const token = localStorage.getItem("token"); // Get user token if available
        const headers = token ? { Authorization: `Bearer ${token}` } : {}; // Add headers conditionally

        const response = await axios.get(
          `http://localhost:3000/api/accommodations/${id}`,
          { headers }
        );

        setAccommodation(response.data); // Store data in state
      } catch (err) {
        console.error("Failed to fetch accommodation details:", err);
        setError(err.response?.data?.error || "An error occurred while fetching data.");
      }
    };

    fetchAccommodation();
  }, [id]);

  if (error) {
    // Show error message to user
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => navigate("/search")}>Back to Search</button>
      </div>
    );
  }

  if (!accommodation) {
    // Show loading message
    return <p>Loading...</p>;
  }

  const handleEdit = () => {
    navigate(`/edit-accommodation/${accommodation.AccommodationID}`);
  };

  const handleDateClick = (date) => {
    alert(`You selected ${date} for booking.`);
    // Add booking logic here
  };

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

      <table className="details-table">
        <thead>
          <tr>
            <th>Amenities</th>
            <th>House Rules</th>
            <th>Available Dates</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <ul>
                {Object.entries(accommodation.Amenities || {}).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value}
                  </li>
                ))}
              </ul>
            </td>
            <td>
              <ul>
                {Object.entries(accommodation.HouseRules || {}).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value}
                  </li>
                ))}
              </ul>
            </td>
            <td>
              <div className="dates-buttons">
                {Array.isArray(accommodation.AvailableDates)
                  ? accommodation.AvailableDates.map((date) => (
                      <button
                        key={date}
                        className="date-button"
                        onClick={() => handleDateClick(date)}
                      >
                        {date}
                      </button>
                    ))
                  : "No dates available"}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Show edit button only if the user is the owner */}
      {accommodation.isOwner && (
        <button className="edit-button" onClick={handleEdit}>
          Edit Accommodation
        </button>
      )}
    </div>
  );
};

export default AccommodationDetails;
