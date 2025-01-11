import React, { useState } from 'react';
import axios from 'axios';

const SearchForm = () => {
  const [location, setLocation] = useState('');
  const [minCost, setMinCost] = useState(0);
  const [maxCost, setMaxCost] = useState(2000);
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/accommodations/search', {
        location,
        pointsRange: [minCost, maxCost],
      });
      setResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <div>
      <h1>Search Accommodations</h1>
      <div>
        <label>
          Location:
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Min Cost:
          <input
            type="number"
            value={minCost}
            onChange={(e) => setMinCost(Number(e.target.value))}
          />
        </label>
        <label>
          Max Cost:
          <input
            type="number"
            value={maxCost}
            onChange={(e) => setMaxCost(Number(e.target.value))}
          />
        </label>
      </div>
      <button onClick={handleSearch}>Search</button>
      <div>
        <h2>Results:</h2>
        {results.length > 0 ? (
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Location</th>
                <th>DailyPointCost</th>
                <th>Description</th>
                <th>AvailableDates</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.Location}</td>
                  <td>{item.DailyPointCost}</td>
                  <td>{item.Description}</td>
                  <td>{item.AvailableDates}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchForm;
