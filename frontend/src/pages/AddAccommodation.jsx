import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import "./AddAccommodation.css"; 

const AddAccommodation = () => {
  const [form, setForm] = useState({
    Title: "",
    Description: "",
    Location: "",
    DailyPointCost: "",
    AvailableDates: [],
    Amenities: {
      wifi: "no",
      pool: "no",
      parking: "no",
      airConditioning: "no",
    },
    HouseRules: {
      smoking: "no",
      petsAllowed: "no",
      partiesAllowed: "no",
    },
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in to access this page.");
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAmenitiesChange = (name, value) => {
    setForm({
      ...form,
      Amenities: { ...form.Amenities, [name]: value },
    });
  };

  const handleHouseRulesChange = (name, value) => {
    setForm({
      ...form,
      HouseRules: { ...form.HouseRules, [name]: value },
    });
  };

  const addDate = (date) => {
    if (!form.AvailableDates.includes(date.toISOString().split("T")[0])) {
      setForm({
        ...form,
        AvailableDates: [...form.AvailableDates, date.toISOString().split("T")[0]],
      });
    }
  };

  const removeDate = (dateToRemove) => {
    setForm({
      ...form,
      AvailableDates: form.AvailableDates.filter((date) => date !== dateToRemove),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formattedForm = {
        ...form,
        Amenities: form.Amenities,
        HouseRules: form.HouseRules,
        AvailableDates: form.AvailableDates,
      };
  
      console.log("Formatted Form:", formattedForm);
  
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Missing authorization token");
        return;
      }
  
      console.log("Authorization Token:", token);
  
      await axios.post("http://localhost:3000/api/accommodations/add", formattedForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      alert("Accommodation added successfully!");
      navigate("/myaccount");
    } catch (err) {
      console.error("Error adding accommodation:", err.response?.data || err);
      setError("Please check your input fields.");
    }
  };

  return (
    <div className="add-accommodation-container">
      <nav className="menu-bar">
        <img src="/treehouse-1@2x.png" alt="Logo" className="menu-logo" />
        <button className="menu-button" onClick={() => navigate("/")}>
          Go to Home
        </button>
      </nav>
      <h2 className="form-title">Add a New Accommodation</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="add-accommodation-form">
        {/* Basic Details */}
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="Title"
            value={form.Title}
            onChange={handleChange}
            placeholder="E.g., Luxury Apartment"
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="Description"
            value={form.Description}
            onChange={handleChange}
            placeholder="E.g., A 2-bedroom apartment with a sea view."
            required
          />
        </div>

        {/* Location and Cost */}
        <div className="form-row">
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="Location"
              value={form.Location}
              onChange={handleChange}
              placeholder="E.g., Istanbul, Turkey"
              required
            />
          </div>
          <div className="form-group">
            <label>Daily Point Cost</label>
            <input
              type="number"
              name="DailyPointCost"
              value={form.DailyPointCost}
              onChange={handleChange}
              placeholder="E.g., 150"
              required
            />
          </div>
        </div>

        {/* Amenities */}
        <div className="form-group">
          <label>Amenities</label>
          <div className="amenities-options">
            {Object.keys(form.Amenities).map((key) => (
              <div key={key} className="toggle-option">
                <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                <div>
                  <button
                    type="button"
                    className={form.Amenities[key] === "yes" ? "active" : ""}
                    onClick={() => handleAmenitiesChange(key, "yes")}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={form.Amenities[key] === "no" ? "active" : ""}
                    onClick={() => handleAmenitiesChange(key, "no")}
                  >
                    No
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* House Rules */}
        <div className="form-group">
          <label>House Rules</label>
          <div className="house-rules-options">
            {Object.keys(form.HouseRules).map((key) => (
              <div key={key} className="toggle-option">
                <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                <div>
                  <button
                    type="button"
                    className={form.HouseRules[key] === "yes" ? "active" : ""}
                    onClick={() => handleHouseRulesChange(key, "yes")}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={form.HouseRules[key] === "no" ? "active" : ""}
                    onClick={() => handleHouseRulesChange(key, "no")}
                  >
                    No
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Dates */}
        <div className="form-group">
          <label>Available Dates</label>
          <DatePicker
            selected={null}
            onChange={addDate}
            placeholderText="Select a date"
            dateFormat="yyyy-MM-dd"
          />
          <div className="selected-dates">
            {form.AvailableDates.map((date) => (
              <div key={date} className="date-item">
                {date}
                <button
                  type="button"
                  onClick={() => removeDate(date)}
                  className="remove-date-button"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-button">
          Add Accommodation
        </button>
      </form>
    </div>
  );
};

export default AddAccommodation;
