import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AccommodationDetails.css";
import styles from "./Karmaacom.module.css";



const AccommodationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accommodation, setAccommodation] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingAccommodation, setLoadingAccommodation] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [loadingAverageRating, setLoadingAverageRating] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [error, setError] = useState(null);
 const [points, setPoints] = useState(null); // Points bilgisini tutuyoruz


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
        setLoadingAccommodation(false);
      } catch (err) {
        console.error("Failed to fetch accommodation details:", err);
        setError(err.response?.data?.error || "An error occurred while fetching data.");
        setLoadingAccommodation(false);
      }
    };
    


    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/accommodations/${id}/reviews`
        );
        setReviews(response.data);
        setLoadingReviews(false);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        setLoadingReviews(false);
      }
    };

    const fetchAverageRating = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/accommodations/${id}/average-rating`
        );
        const rating = parseFloat(response.data.averageRating) || 0; // Gelen değeri sayıya dönüştür
        setAverageRating(rating);
        setLoadingAverageRating(false);
      } catch (err) {
        console.error("Failed to fetch average rating:", err);
        setAverageRating(0); // Hata durumunda default değeri 0 olarak ayarla
        setLoadingAverageRating(false);
      }
    };

    fetchAccommodation();
    fetchReviews();
    fetchAverageRating();
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

  if (loadingAccommodation) {
    // Show loading message
    return <p>Loading accommodation details...</p>;
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
            <nav className="menu-bar">
              <img src="/treehouse-1@2x.png" alt="Logo" className="menu-logo" />
                      
                        <button className="menu-button" onClick={() => navigate("/search")}>
        Search
      </button>
              
                      <button className="menu-button" onClick={() => navigate("/")}>
                        Go to Home
                      </button>
                      <div className="menu-button">
                        
                                  {/* Kullanıcı giriş yapmışsa points'i göster */}
                                  {points !== null && (
                                    <div className={styles.button}>
                                      {`Points: ${points}`}
                                    </div>
                                  )}
                        </div>
                    </nav>

    
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

      {/* Average Rating Section */}
      <div className="average-rating-section">
        <h3>
          Average Rating: {loadingAverageRating
            ? "Loading..."
            : averageRating > 0
            ? `⭐ ${averageRating.toFixed(1)} / 5`
            : "No ratings yet"}
        </h3>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h3>Reviews & Ratings</h3>
        {loadingReviews ? (
          <p>Loading reviews...</p>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.ReviewID} className="review-card">
              <p><strong>{review.ReviewerName}</strong></p>
              <p>Rating: {review.Rating}/5</p>
              <p>{review.Comment}</p>
              <p className="review-date">{new Date(review.CreatedAt).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default AccommodationDetails;
