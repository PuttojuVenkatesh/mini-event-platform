import { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import { AppBar, Toolbar } from "@mui/material";


import axios from "axios";
import {
  Container, Card, CardContent, CardMedia,
  Typography, Button, TextField, Grid
} from "@mui/material";

const API = "https://mini-event-platform-backend.onrender.com/api";


function App() {
  const [events, setEvents] = useState([]);
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [form, setForm] = useState({
  title: "",
  description: "",
  dateTime: "",
  location: "",
  capacity: "",
  imageUrl: ""
});



  const loadEvents = async () => {
    const res = await axios.get(`${API}/events`);
    setEvents(res.data);
  };

  const deleteEvent = async (id) => {
  if (!window.confirm("Delete this event?")) return;

  try {
    await axios.delete(
      `${API}/events/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Event deleted");
    loadEvents();
  } catch {
    alert("Delete failed");
  }
};

const editEvent = async (event) => {
  const newTitle = prompt("New title", event.title);
  if (!newTitle) return;

  try {
    await axios.put(
      `${API}/events/${event._id}`,
      { title: newTitle },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Event updated");
    loadEvents();
  } catch {
    alert("Edit failed");
  }
};



  useEffect(() => {
    loadEvents();
  }, []);

  const rsvp = async (id) => {
    await axios.post(
      `${API}/events/${id}/rsvp`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    loadEvents();
  };

  const createEvent = async () => {
  if (!token) {
    alert("Paste JWT token first");
    return;
  }

  try {
    await axios.post(
      `${API}/events`,
      form,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Event created successfully");
    setForm({
      title: "",
      description: "",
      dateTime: "",
      location: "",
      capacity: "",
      imageUrl: ""
    });
    loadEvents();
  } catch (err) {
    alert("Failed to create event");
  }
};


  return (
  <>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h4">
           Mini Event Platform
          
        </Typography>
       
      </Toolbar>
    </AppBar>

    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
      A simple and secure platform to create events and manage RSVPs efficiently.
      </Typography>

      <TextField
        label="Paste JWT Token"
        fullWidth
        sx={{ mb: 3 }}
        onChange={(e) => {
          const t = e.target.value;
          setToken(t);
          try {
            const decoded = jwtDecode(t);
            setUserId(decoded.userId);
          } catch {
            setUserId("");
          }
        }}
      />

      <Card
  sx={{
    mb: 5,
    p: 3,
    boxShadow: 4,
    borderRadius: 3
  }}
>
  <Typography variant="h5" gutterBottom>
    Create Event
  </Typography>

  <TextField
    label="Title"
    fullWidth
    sx={{ mb: 2 }}
    value={form.title}
    onChange={(e) => setForm({ ...form, title: e.target.value })}
  />

  <TextField
    label="Description"
    fullWidth
    sx={{ mb: 2 }}
    value={form.description}
    onChange={(e) => setForm({ ...form, description: e.target.value })}
  />

  <TextField
    label="Date & Time"
    fullWidth
    sx={{ mb: 2 }}
    placeholder="YYYY-MM-DD HH:mm"
    value={form.dateTime}
    onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
  />

  <TextField
    label="Location"
    fullWidth
    sx={{ mb: 2 }}
    value={form.location}
    onChange={(e) => setForm({ ...form, location: e.target.value })}
  />

  <TextField
    label="Capacity"
    type="number"
    fullWidth
    sx={{ mb: 2 }}
    value={form.capacity}
    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
  />

  <TextField
    label="Image URL"
    fullWidth
    sx={{ mb: 2 }}
    value={form.imageUrl}
    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
  />

  <Button variant="contained" onClick={createEvent}>
    Create Event
  </Button>
</Card>


      <Grid container spacing={3}>
        {events.map(event => (
          <Grid item xs={12} md={6} lg={4} key={event._id}>
            <Card>
              <CardMedia
                component="img"
                height="160"
                image={event.imageUrl || "https://via.placeholder.com/300"}
              />
              <CardContent>
                <Typography variant="h6">{event.title}</Typography>
                <Typography>{event.location}</Typography>
                <Typography>
                  {event.attendeesCount} / {event.capacity}
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => rsvp(event._id)}
                >
                  RSVP
                </Button>

                {event.createdBy === userId && (
                  <>
                    <Button
                      fullWidth
                      color="warning"
                      sx={{ mt: 1 }}
                      onClick={() => editEvent(event)}
                    >
                      Edit
                    </Button>

                    <Button
                      fullWidth
                      color="error"
                      sx={{ mt: 1 }}
                      onClick={() => deleteEvent(event._id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  </>
);

}

export default App;
