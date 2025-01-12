import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyAccount.css";
import { useNavigate } from "react-router-dom";

const formatDateForMySQL = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const MyAccount = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token bulunamadı. Lütfen giriş yapın.");

        const response = await axios.get("http://localhost:3000/api/users/MyAccount", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Kullanıcı bilgileri alınırken hata:", err);
        setError("Kullanıcı bilgileri alınamadı.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleSave = async () => {
    const formattedDate = formatDateForMySQL(user.DateOfBirth);
    const updatedUser = { ...user, DateOfBirth: formattedDate };

    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:3000/api/users/MyAccount", updatedUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Bilgiler başarıyla güncellendi!");
      setIsEditing(false);
    } catch (err) {
      console.error("Bilgiler güncellenirken hata:", err);
      alert("Bilgiler güncellenirken hata oluştu.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="my-account-container">
      <nav className="menu-bar">
        <img src="/treehouse-1@2x.png" alt="Logo" className="menu-logo" />
        <button className="menu-button" onClick={() => navigate("/")}>Go to Home</button>
        <button className="menu-button" onClick={handleLogout}>Logout</button>
      </nav>
      <div className="profile-header">
        <div>
          <h2>{user.Name}</h2>
          <p>{user.Email}</p>
        </div>
        <button className="edit-button" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      <div className="profile-details">
        <div className="details-column">
          <label>Full Name</label>
          <input
            type="text"
            value={user.Name}
            onChange={(e) => setUser({ ...user, Name: e.target.value })}
            disabled={!isEditing}
          />

          <label>Gender</label>
          <div className="gender-buttons">
            <button
              className={user.Gender === "Male" ? "active" : ""}
              onClick={() => setUser({ ...user, Gender: "Male" })}
              disabled={!isEditing}
            >
              Male
            </button>
            <button
              className={user.Gender === "Female" ? "active" : ""}
              onClick={() => setUser({ ...user, Gender: "Female" })}
              disabled={!isEditing}
            >
              Female
            </button>
          </div>

          <label>Date of Birth</label>
          <input
            type="date"
            value={user.DateOfBirth ? user.DateOfBirth.split("T")[0] : ""}
            onChange={(e) => setUser({ ...user, DateOfBirth: e.target.value })}
            disabled={!isEditing}
          />
        </div>

        <div className="details-column">
          <label>Country</label>
          <input
            type="text"
            value={user.Country}
            onChange={(e) => setUser({ ...user, Country: e.target.value })}
            disabled={!isEditing}
          />

          <label>Time Zone</label>
          <input
            type="text"
            value={user.TimeZone}
            onChange={(e) => setUser({ ...user, TimeZone: e.target.value })}
            disabled={!isEditing}
          />
        </div>
      </div>

      {isEditing && (
        <button className="save-button" onClick={handleSave}>Save</button>
      )}
    </div>
  );
};

export default MyAccount;