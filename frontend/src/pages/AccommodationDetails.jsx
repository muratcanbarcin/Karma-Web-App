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
  const [canReview, setCanReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: "", comment: "" });
  const [loadingAccommodation, setLoadingAccommodation] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [loadingAverageRating, setLoadingAverageRating] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(
          `http://localhost:3000/api/accommodations/${id}`,
          { headers }
        );
        setAccommodation(response.data);
        setLoadingAccommodation(false);
      } catch (err) {
        console.error("Failed to fetch accommodation details:", err);
        setError(err.response?.data?.error || "An error occurred.");
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
        setAverageRating(parseFloat(response.data.averageRating) || 0);
        setLoadingAverageRating(false);
      } catch (err) {
        console.error("Failed to fetch average rating:", err);
        setAverageRating(0);
        setLoadingAverageRating(false);
      }
    };

    const checkReviewPermission = async () => {
      setCanReview(true); // Booking kontrolünü kaldırdık, yorum yapabilme izni doğrudan veriliyor.
    };
    


    fetchAccommodation();
    fetchReviews();
    fetchAverageRating();
    if (token) checkReviewPermission();
  }, [id, token]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting review:", newReview); // Bu satırı ekleyin
    try {
      await axios.post(
        `http://localhost:3000/api/accommodations/reviews/add`, // Tam adresi kullanın
        { accommodationId: id, ...newReview },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("Yorum başarıyla eklendi!");
      setNewReview({ rating: "", comment: "" });
      setReviews((prev) => [...prev, { ...newReview, ReviewerName: "You" }]);
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };
  

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => navigate("/search")}>Back to Search</button>
      </div>
    );
  }

  if (loadingAccommodation) {
    return <p>Loading accommodation details...</p>;
  }

  return (
    <div className="details-container">
      <nav className="menu-bar">
        <img src="/treehouse-1@2x.png" alt="Logo" className="menu-logo" />
        <button className="menu-button" onClick={() => navigate("/search")}>
          Search
        </button>
        <button className="menu-button" onClick={() => navigate("/")}>Go to Home</button>
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
                  <li key={key}>{key}: {value}</li>
                ))}
              </ul>
            </td>
            <td>
              <ul>
                {Object.entries(accommodation.HouseRules || {}).map(([key, value]) => (
                  <li key={key}>{key}: {value}</li>
                ))}
              </ul>
            </td>
            <td>
              <div className="dates-buttons">
                {Array.isArray(accommodation.AvailableDates) ? (
                  accommodation.AvailableDates.map((date) => (
                    <button
                      key={date}
                      className="date-button reservation-button"
                      onClick={() => console.log(`Reserve ${date}`)}
                    >
                      Reserve {date}
                    </button>
                  ))
                ) : (
                  "No dates available"
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="average-rating-section">
        <h3>
          Average Rating: {loadingAverageRating
            ? "Loading..."
            : averageRating > 0
              ? `⭐ ${averageRating.toFixed(1)} / 5`
              : "No ratings yet"}
        </h3>
      </div>

      <div className="reviews-section">
        <h3>Reviews & Ratings</h3>
        {loadingReviews ? (
          <p>Loading reviews...</p>
        ) : reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="review-card">
              <p><strong>{review.ReviewerName}</strong></p>
              <p>Rating: {review.rating || review.Rating}/5</p>
              <p>{review.comment || review.Comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}

        {canReview ? (
          <form onSubmit={handleReviewSubmit}>
            <div>
              <label>
                Rating:
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Comment:
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  required
                />
              </label>
            </div>
            <button type="submit">Submit Review</button>
          </form>
        ) : (
          <p>Yorum yapabilmek için önce misafir olmanız gerekmektedir.</p>
        )}
      </div>
    </div>
  );
};

export default AccommodationDetails;
