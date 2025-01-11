import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AccommodationDetails.css";

const AccommodationDetails = () => {
    const { id } = useParams();
    const [details, setDetails] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/accommodations/${id}`);
                setDetails(response.data);
            } catch (error) {
                console.error("Failed to fetch details:", error);
            }
        };

        fetchDetails();
    }, [id]);

    if (!details) {
        return <p>Loading...</p>;
    }

    const formattedDates = details.AvailableDates
        ? JSON.parse(details.AvailableDates).join(", ")
        : "No dates available";

    return (
        <div className="details-container">
            <button className="back-button" onClick={() => navigate("/search")}>Back to Search</button>
            <h1>{details.Title}</h1>
            <img
                src={details.image || "/105m2_934x700.webp"}
                alt={details.Title}
                className="details-image"
            />
            <h2>{details.DailyPointCost} Points</h2>
            <p>{details.Description}</p>
            <div>
                <h3>Location</h3>
                <p>{details.Location}</p>
            </div>
            <div>
                <h3>Amenities</h3>
                <pre>{JSON.stringify(JSON.parse(details.Amenities || "{}"), null, 2)}</pre>
            </div>
            <div>
                <h3>House Rules</h3>
                <pre>{JSON.stringify(JSON.parse(details.HouseRules || "{}"), null, 2)}</pre>
            </div>
            <div>
                <h3>Available Dates</h3>
                <p>{formattedDates}</p>
            </div>
        </div>
    );
};

export default AccommodationDetails;
