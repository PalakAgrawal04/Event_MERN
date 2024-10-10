import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { addEvent, getEvents, updateEvent, deleteEvent, sendInvitation } from '../api'; // Import event-related APIs

const AdminDashboard = () => {
  // Event Management State
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({ name: '', description: '', date: '', time: '', organization: '' });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  // Guest Invitation State
  const [inviteData, setInviteData] = useState({
    guestEmail: '',
    guestName: '',
    eventName: '',
    eventDate: '',
    eventTime: '',
    organizer: 'Event Organizer',  // Organizer name (could be dynamically populated)
  });
  const [inviteResponse, setInviteResponse] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch all events
  const fetchEvents = async () => {
    const { data } = await getEvents();
    setEvents(data);
  };

  // Submit event (add or update)
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

  // Submit invitation
  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await sendInvitation(inviteData);
      setInviteResponse(data.msg);  // Display success message
    } catch (error) {
      setInviteResponse('Error sending invitation.');
    }
  };

  // Edit event
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

  // Delete event
  const handleDelete = async (id) => {
    await deleteEvent(id);
    fetchEvents();
  };

  // Clear event form
  const clearForm = () => {
    setFormData({ name: '', description: '', date: '', time: '', organization: '' });
    setEditMode(false);
    setEditId(null);
  };

  // Handle form field changes for events
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form field changes for invitations
  const handleInviteChange = (e) => {
    setInviteData({ ...inviteData, [e.target.name]: e.target.value });
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token
    localStorage.removeItem('role'); // Remove role
    navigate('/'); // Navigate to the login page
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <button onClick={handleLogout}>Logout</button> {/* Logout button */}

      {/* Event Management Form */}
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

      {/* Guest Invitation Form */}
      <h3>Send Guest Invitation</h3>
      <form onSubmit={handleInviteSubmit}>
        <input
          type="text"
          name="guestName"
          value={inviteData.guestName}
          onChange={handleInviteChange}
          placeholder="Guest Name"
          required
        />
        <input
          type="email"
          name="guestEmail"
          value={inviteData.guestEmail}
          onChange={handleInviteChange}
          placeholder="Guest Email"
          required
        />
        <input
          type="text"
          name="eventName"
          value={inviteData.eventName}
          onChange={handleInviteChange}
          placeholder="Event Name"
          required
        />
        <input
          type="date"
          name="eventDate"
          value={inviteData.eventDate}
          onChange={handleInviteChange}
          required
        />
        <input
          type="time"
          name="eventTime"
          value={inviteData.eventTime}
          onChange={handleInviteChange}
          required
        />
        <button type="submit">Send Invitation</button>
      </form>

      {/* Display response message */}
      {inviteResponse && <p>{inviteResponse}</p>}
    </div>
  );
};

export default AdminDashboard;
