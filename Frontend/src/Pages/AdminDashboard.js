// src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { addEvent, getEvents, updateEvent, deleteEvent } from '../api'; // Import event-related API

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', date: '', time: '', organization: '' });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data } = await getEvents();
    setEvents(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await updateEvent(editId, formData);
    } else {
      await addEvent(formData);
    }
    fetchEvents();
    clearForm();
  };

  const handleEdit = (event) => {
    setEditMode(true);
    setEditId(event._id);
    setFormData({
      name: event.name,
      description: event.description,
      date: event.date.split('T')[0],
      time: event.time,
      organization: event.organization,
    });
  };

  const handleDelete = async (id) => {
    await deleteEvent(id);
    fetchEvents();
  };

  const clearForm = () => {
    setFormData({ name: '', description: '', date: '', time: '', organization: '' });
    setEditMode(false);
    setEditId(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token
    localStorage.removeItem('role'); // Remove role
    navigate('/'); // Navigate to the login page
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <button onClick={handleLogout}>Logout</button> {/* Logout button */}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Event Name"
          required
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="organization"
          value={formData.organization}
          onChange={handleChange}
          placeholder="Organization"
        />
        <button type="submit">{editMode ? 'Update Event' : 'Add Event'}</button>
        {editMode && <button type="button" onClick={clearForm}>Cancel Edit</button>}
      </form>

      <h3>Events List</h3>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <div>
              <strong>{event.name}</strong> <br />
              {event.date} at {event.time} <br />
              {event.description && <p>{event.description}</p>}
              <p>Organized by: {event.organization}</p>
            </div>
            <div>
              <button className="edit-button" onClick={() => handleEdit(event)}>Edit</button>
              <button className="delete-button" onClick={() => handleDelete(event._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
