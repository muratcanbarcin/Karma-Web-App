import React, { useState } from 'react';

const SearchForm = () => {
    const [houseType, setHouseType] = useState('');
    const [pointsRange, setPointsRange] = useState([0, 5000]);
    const [location, setLocation] = useState('');
    const [accommodationID, setAccommodationID] = useState('');
    const [availableDates, setAvailableDates] = useState({});

    const handleSearch = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/accommodations/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ houseType, pointsRange, location, accommodationID, availableDates }),
            });

            const results = await response.json();
            console.log('Search Results:', results);
        } catch (error) {
            console.error('Error searching accommodations:', error);
        }
    };

    return (
        <div>
            <h1>Search Accommodations</h1>
            <div>
                <label>House Type:</label>
                <select value={houseType} onChange={(e) => setHouseType(e.target.value)}>
                    <option value="">Select</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Residence">Residence</option>
                    <option value="Detached House">Detached House</option>
                </select>
            </div>
            <div>
                <label>Points Range:</label>
                <input
                    type="number"
                    value={pointsRange[0]}
                    onChange={(e) => setPointsRange([+e.target.value, pointsRange[1]])}
                    placeholder="Min Points"
                />
                <input
                    type="number"
                    value={pointsRange[1]}
                    onChange={(e) => setPointsRange([pointsRange[0], +e.target.value])}
                    placeholder="Max Points"
                />
            </div>
            <div>
                <label>Location:</label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div>
                <label>Accommodation ID:</label>
                <input type="text" value={accommodationID} onChange={(e) => setAccommodationID(e.target.value)} />
            </div>
            <div>
                <label>Available Dates:</label>
                <input
                    type="date"
                    onChange={(e) => setAvailableDates({ ...availableDates, start: e.target.value })}
                />
                <input
                    type="date"
                    onChange={(e) => setAvailableDates({ ...availableDates, end: e.target.value })}
                />
            </div>
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default SearchForm;
