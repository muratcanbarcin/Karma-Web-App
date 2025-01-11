import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AccommodationDetails.css";

const AccommodationDetails = () => {
  const { id } = useParams(); // URL'deki ID'yi al
  const [details, setDetails] = useState(null); // Konaklama detaylarını tutacak state
  const navigate = useNavigate(); // Geri navigasyon için hook

  // Konaklama detaylarını fetch eden fonksiyon
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/accommodations/${id}`);
        console.log("Fetched Details:", response.data); // Gelen veriyi kontrol edin
        setDetails(response.data); // Gelen veriyi state'e atayın
      } catch (error) {
        console.error("Failed to fetch details:", error);
      }
    };

    fetchDetails();
  }, [id]);

  // Veriler yüklenirken loading göstergesi
  if (!details) {
    return <p>Loading...</p>;
  }

  return (
    <div className="details-container">
      <button className="back-button" onClick={() => navigate("/search")}> {/* Geri dönüş butonu */}
        Back to Search
      </button>
      <h1>{details.Location || "Unknown Location"}</h1> {/* Lokasyon */}
      <img
        src={details.image || "/105m2_934x700.webp"} // Görsel veya varsayılan görsel
        alt={details.Location || "Accommodation"}
        className="details-image"
      />
      <h2>{details.DailyPointCost ? `${details.DailyPointCost} Points` : "No Cost Info"}</h2> {/* Günlük puan maliyeti */}
      <p>{details.Description || "No Description Available"}</p> {/* Açıklama */}
    </div>
  );
};

export default AccommodationDetails;
