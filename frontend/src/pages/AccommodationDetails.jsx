import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AccommodationDetails.css";
import Rating from "react-rating-stars-component"; // Yıldız derecelendirme için
import styles from "./Karmaacom.module.css";



const AccommodationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accommodation, setAccommodation] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [rating, setRating] = useState(0); // Default rating is 0
  const [comment, setComment] = useState(""); // Initialize the comment state as an empty string

  const [loadingAccommodation, setLoadingAccommodation] = useState(true);
  const [loadingAverageRating, setLoadingAverageRating] = useState(true);
  const [confirmedBookings, setConfirmedBookings] = useState([]);
const [alreadyReviewed, setAlreadyReviewed] = useState([]);
const [currentUserID, setCurrentUserID] = useState(null);
const [selectedBooking, setSelectedBooking] = useState("");

const handleRatingChange = (newRating) => {
  setRating(parseFloat(newRating)); // Float olarak işlenmesini sağlıyoruz
};


useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT
    setCurrentUserID(decodedToken.userID);
  }
}, []);
  
  const [error, setError] = useState(null);
 const [points, setPoints] = useState(null); // Points bilgisini tutuyoruz

 useEffect(() => {
  const fetchConfirmedBookings = async () => {
    if (!currentUserID) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/accommodations/myBookings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Filter bookings that are "Confirmed" and belong to this accommodation
      const confirmedForThisAccommodation = response.data.filter(
        (booking) =>
          booking.Status === "Confirmed" &&
          booking.AccommodationID === parseInt(id)
      );

      setConfirmedBookings(confirmedForThisAccommodation);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  fetchConfirmedBookings();
}, [currentUserID, id]);

  useEffect(() => {
  const fetchAlreadyReviewedBookings = async () => {
    if (!currentUserID) return; // Wait until currentUserID is set

    try {
      const response = await axios.get(
        `http://localhost:3000/api/accommodations/${id}/reviews`
      );
      const reviewedBookingIDs = response.data
        .filter((review) => review.ReviewerID === currentUserID)
        .map((review) => review.BookingID);
      setAlreadyReviewed(reviewedBookingIDs);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  fetchAlreadyReviewedBookings();
}, [currentUserID, id]);
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
  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/accommodations/${id}/reviews`
      );
      setReviews(response.data); // Gelen yorumları state'e kaydet
      setLoadingReviews(false); // Yükleme durumunu kapat
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setLoadingReviews(false); // Hata durumunda da yükleme kapatılmalı
    }
  };

  fetchReviews(); // Yorumları çek



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
        setError(
          err.response?.data?.error || "An error occurred while fetching data."
        );
        setLoadingAccommodation(false);
      }
    };
    


    
    const fetchAverageRating = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/accommodations/${id}/average-rating`
        );
        setAverageRating(response.data.averageRating);
      } catch (err) {
        console.error("Error fetching average rating:", err);
      }
    };

    fetchAccommodation();
    fetchReviews();
    fetchAverageRating();
  }, [id]);

  const handleAddReview = async () => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        alert("You need to log in to submit a review.");
        return;
      }
  
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Token'dan userID al
      const reviewerID = decodedToken.userID; // Oturum açan kullanıcı ID'si
      const revieweeID = accommodation.OwnerID; // İlan sahibinin ID'si
  
      const reviewData = {
        bookingID: selectedBooking,
        rating: parseInt(rating),
        comment,
        reviewerID,
        revieweeID,
      };
  
      console.log("Submitting review data:", reviewData);
  
      await axios.post(
        `http://localhost:3000/api/accommodations/${id}/reviews`,
        reviewData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      alert("Review added successfully!");
  
      // Yorumları yenile
      fetchReviews();
    } catch (err) {
      console.error("Error adding review:", err);
      alert("Failed to add review.");
    }
  };
  
  
  

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

  const handleReservation = async (selectedDate) => {
    console.log("Reservation Payload:", {
      startDate: selectedDate,
      endDate: selectedDate,
    }); // Log the reservation payload for debugging
  
    if (!localStorage.getItem("token")) {
      alert("You need to log in to make a reservation.");
      navigate("/AuthForm");
      return;
    }
  
    const confirmation = window.confirm(
      "Are you sure you want to reserve this date?"
    );
    if (!confirmation) return;
  
    const token = localStorage.getItem("token");
  
    try {
      // Make the API call to create a reservation
      const response = await axios.post(
        `http://localhost:3000/api/accommodations/${accommodation.AccommodationID}/bookings`,
        {
          startDate: selectedDate,
          endDate: selectedDate, // In case you allow multi-day bookings later
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      console.log("Reservation Response:", response); // Log the server response
  
      // Alert the user of a successful reservation
      alert("Reservation successful!");
  
      // Update the local state to remove the reserved date
      setAccommodation((prevState) => ({
        ...prevState,
        AvailableDates: prevState.AvailableDates.filter(
          (date) => date !== selectedDate
        ),
      }));
    } catch (error) {
      // Log the error for debugging
      console.error("Reservation Error:", error.response?.data || error);
  
      // Show an error message to the user
      alert(error.response?.data?.error || "Reservation failed.");
    }
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
              {Object.entries(accommodation.Amenities || {}).map(
                  ([key, value]) => (
                    <li key={key}>
                      {key}: {value}
                    </li>
                  )
                )}
              </ul>
            </td>
            <td>
              <ul>
              {Object.entries(accommodation.HouseRules || {}).map(
                  ([key, value]) => (
                    <li key={key}>
                      {key}: {value}
                    </li>
                  )
                )}
              </ul>
            </td>
            <td>
              <div className="dates-buttons">
                {Array.isArray(accommodation.AvailableDates)
                  ? accommodation.AvailableDates.map((date) => (
                      <button
                        key={date}
                        className="date-button reservation-button"
                        onClick={() => handleReservation(date)}
                      >
                        Reserve {date}
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
    Average Rating: ⭐{" "}
    {averageRating && typeof averageRating === "number"
      ? averageRating.toFixed(2)
      : "No ratings yet"}{" "}
    / 5
  </h3>
</div>


<div className="reviews-section">
  <h3>Reviews & Ratings</h3>
  {loadingReviews ? (
    <p>Loading reviews...</p>
  ) : reviews.length > 0 ? (
    reviews.map((review) => (
      <div key={review.ReviewID} className="review-card">
        <p><strong>{review.ReviewerName}</strong></p>
        <p>
  Rating:{" "}
  {review.Rating !== null && !isNaN(review.Rating)
    ? `${parseFloat(review.Rating).toFixed(1)}/5`
    : "No rating available"}
</p>

        <p>{review.Comment}</p>
        <p className="review-date">{new Date(review.CreatedAt).toLocaleDateString()}</p>
      </div>
    ))
  ) : (
    <p>No reviews yet.</p>
  )}


  {/* Add Review Section */}
  {confirmedBookings.length > 0 ? (
    <div className="add-review-section">
      <h3>Leave a Review</h3>
      <Rating
        count={5}
        size={30}
        isHalf={true} 
        value={rating}
        activeColor="#ffd700"
        onChange={handleRatingChange}
      />
      <select
        id="booking"
        value={selectedBooking}
        onChange={(e) => setSelectedBooking(e.target.value)}
      >
        <option value="">Select a Booking</option>
        {confirmedBookings
          .filter((booking) => !alreadyReviewed.includes(booking.BookingID))
          .map((booking) => (
            <option key={booking.BookingID} value={booking.BookingID}>
              Booking ID: {booking.BookingID}
            </option>
          ))}
      </select>


      <textarea
        id="comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment here..."
        required
      ></textarea>

      <button onClick={handleAddReview}>Submit Review</button>
    </div>
  ) : (
    <p>Only users who have stayed here can leave a review.</p>
  )}
</div>

    </div>
  );
};

export default AccommodationDetails;
