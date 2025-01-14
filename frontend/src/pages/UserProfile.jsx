import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./UserProfile.module.css"; // CSS module for modern styling

const UserProfile = () => {
  const { userId } = useParams(); // Extract userId from the URL
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data when the component mounts or userId changes
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You need to log in to view this profile.");
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("An error occurred while fetching user data.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Display loading state
  if (loading) return <div className={styles.loading}>Loading...</div>;

  // Display error message if there is an error
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <img
          src="/default-avatar.png" // Default profile picture
          alt="Profile"
          className={styles.profileImage}
        />
        <h1 className={styles.profileName}>{userData.Name}</h1>
      </div>
      <div className={styles.profileDetails}>
        <p><strong>Email:</strong> {userData.Email}</p>
        <p><strong>Gender:</strong> {userData.Gender}</p>
        <p><strong>Country:</strong> {userData.Country}</p>
        <p><strong>Date of Birth:</strong> {userData.DateOfBirth}</p>
        <p><strong>Time Zone:</strong> {userData.TimeZone}</p>
        <p><strong>Points Balance:</strong> {userData.PointsBalance}</p>
      </div>
    </div>
  );
};

export default UserProfile;
