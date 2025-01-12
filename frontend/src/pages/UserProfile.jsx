import React from "react";
import "./UserProfile.css";

const UserProfile = ({ user }) => {
  return (
    <div className="profile-container">
      <img
        src={user.profilePicture || "default-profile.png"}
        alt="Profile"
        className="profile-picture"
      />
      <h1 className="profile-name">{user.name}</h1>
      <p className="profile-bio">{user.bio || "No bio available."}</p>

      <div className="info-card">
        <div>
          <span>Email</span>
          {user.email}
        </div>
        <div>
          <span>Date of Birth</span>
          {user.dateOfBirth || "Not provided"}
        </div>
        <div>
          <span>Points Balance</span>
          {user.pointsBalance || 0}
        </div>
      </div>

      <div className="profile-actions">
        <button className="btn btn-edit">Edit Profile</button>
        <button className="btn btn-settings">Settings</button>
      </div>
    </div>
  );
};

export default UserProfile;