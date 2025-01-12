import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyAccount.css";

const MyAccount = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token bulunamadı. Lütfen giriş yapın.");
  
        const response = await axios.get("http://localhost:3000/api/users/MyAccount", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Kullanıcı bilgileri alınırken hata:", err.response || err);
        setError("Kullanıcı bilgileri alınamadı.");
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="my-account-container">
      <div className="profile-header">
        <img
          src="https://via.placeholder.com/80" // Profil fotoğrafı için placeholder
          alt="User Profile"
          className="profile-picture"
        />
        <div className="profile-info">
          <h2>{user.Name}</h2>
          <p>{user.Email}</p>
        </div>
        <button className="edit-button">Edit</button>
      </div>

      <div className="profile-details">
        <div className="details-column">
          <label>Full Name</label>
          <input type="text" value={user.Name} readOnly />

          <label>Gender</label>
          <input type="text" value={user.Gender || "Not specified"} readOnly />

          <label>Date of Birth</label>
          <input type="text" value={user.DateOfBirth || "Not specified"} readOnly />
        </div>
        <div className="details-column">
          <label>UserID</label>
          <input type="text" value="12345" readOnly />

          <label>Country</label>
          <input type="text" value={user.Country || "Not specified"} readOnly />

          <label>Time Zone</label>
          <input type="text" value={user.TimeZone || "Not specified"} readOnly />
        </div>
      </div>

      <div className="email-section">
        <h3>My Email Address</h3>
        <div className="email-item">
          <span className="email-icon">✔</span>
          <div className="email-info">
            <p>{user.Email}</p>
            <small>Added 1 month ago</small>
          </div>
        </div>
        <button className="add-email-button">+ Add Email Address</button>
      </div>
    </div>
  );
};

export default MyAccount;