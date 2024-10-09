// src/pages/StudentDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { getEvents } from '../api'; // Import event-related API

const StudentDashboard = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data } = await getEvents();
    setEvents(data);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token
    localStorage.removeItem('role'); // Remove role
    navigate('/'); // Navigate to the login page
  };

  return (
    <div className="container">
      <h2>Student Dashboard</h2>
      <button onClick={handleLogout}>Logout</button> {/* Logout button */}
      <h3>Upcoming and Ongoing Events</h3>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <div>
              <strong>{event.name}</strong> <br />
              {event.date} at {event.time} <br />
              {event.description && <p>{event.description}</p>}
              <p>Organized by: {event.organization}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentDashboard;
