import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AccommodationDetails.css";

const AccommodationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accommodation, setAccommodation] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: "", comment: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/accommodations/${id}`);
        setAccommodation(response.data);
      } catch (error) {
        console.error("Failed to fetch accommodation details:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/accommodations/${id}/reviews`);
        setReviews(response.data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    const checkLogin = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    fetchAccommodation();
    fetchReviews();
    checkLogin();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to submit a review.");
        return;
      }
  
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // JWT decode
      const userId = decodedToken.userId;
  
      await axios.post(
        `http://localhost:3000/api/accommodations/${id}/reviews`,
        {
          BookingID: 1, // Replace with a valid BookingID
          ReviewerID: userId,
          Rating: newReview.rating,
          Comment: newReview.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      alert("Review submitted successfully!");
      setNewReview({ rating: "", comment: "" });
      const response = await axios.get(`http://localhost:3000/api/accommodations/${id}/reviews`);
      setReviews(response.data);
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Failed to submit review. Please try again.");
    }
  };
  
  

  if (!accommodation) {
    return <p>Loading...</p>;
  }

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
      <p><strong>Average Rating:</strong> {accommodation.AverageRating !== "No ratings yet" ? `${accommodation.AverageRating} / 5` : "No ratings yet"}</p>

      <div className="reviews-section">
        <h3>Ratings and Reviews</h3>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="review-card">
              <p>
                <strong>{review.ReviewerName}:</strong> {review.Rating} / 5
              </p>
              <p>{review.Comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews available for this accommodation.</p>
        )}
      </div>

      {isLoggedIn && (
        <div className="review-form">
          <h3>Submit Your Review</h3>
          <form onSubmit={handleReviewSubmit}>
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
            <label>
              Comment:
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                required
              ></textarea>
            </label>
            <button type="submit">Submit Review</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AccommodationDetails;
