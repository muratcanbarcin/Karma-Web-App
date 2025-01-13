import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from "react-router-dom";
import "./AddAccommodation.css";

const EditAccommodation = () => {
  const { id } = useParams(); // URL'den Accommodation ID'sini al
  const [form, setForm] = useState(null); // Form verileri
  const [error, setError] = useState(""); // Genel hata mesajı
  const [unauthorized, setUnauthorized] = useState(false); // Yetkisiz erişim durumu
  const navigate = useNavigate();

  // Konaklama bilgilerini backend'den al
  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/api/accommodations/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
  
        const data = response.data;
  
        if (!data.isOwner) {
          alert("You are not authorized to edit this accommodation.");
          navigate("/myaccount"); // Kullanıcıyı başka bir sayfaya yönlendirin
          return;
        }
  
        setForm({
          ...data,
          Amenities: data.Amenities || {},
          HouseRules: data.HouseRules || {},
          AvailableDates: data.AvailableDates || [],
        });
      } catch (err) {
        if (err.response?.status === 403) {
          setUnauthorized(true);
        } else {
          console.error("Error fetching accommodation details:", err.response?.data || err);
          setError("Failed to fetch accommodation details.");
        }
      }
    };
  
    fetchAccommodation();
  }, [id]);
  

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
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/accommodations/${id}`,
        form, // Form verilerini gönder
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Accommodation updated successfully!");
      navigate("/myaccount");
    } catch (err) {
      console.error("Error updating accommodation:", err.response?.data || err);
      setError("Failed to update accommodation. Please check your input.");
    }
  };

  if (unauthorized) {
    // Yetkisiz erişim mesajı
    return <p>You are not authorized to edit this accommodation.</p>;
  }

  if (!form) {
    // Yükleme durumu
    return <p>Loading accommodation details...</p>;
  }

  return (
    <div className="add-accommodation-container">
      <h2 className="form-title">Edit Accommodation</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="add-accommodation-form">
        {/* Title */}
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
        {/* Description */}
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

        {/* Location & Cost */}
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
            {Object.keys(form.Amenities || {}).map((key) => (
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
            {Object.keys(form.HouseRules || {}).map((key) => (
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

        {/* Submit */}
        <button type="submit" className="submit-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditAccommodation;
