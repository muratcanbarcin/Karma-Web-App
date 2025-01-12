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
        const response = await axios.get(
          `http://localhost:3000/api/accommodations/${id}`
        );
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

  const handleDateClick = (date) => {
    alert(`You selected ${date} for booking.`);
    // Booking işlemleri için bu alanda gerekli API çağrıları yapılabilir
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
    </div>
  );
};

export default AccommodationDetails;
