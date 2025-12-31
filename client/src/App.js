import { useEffect, useState } from "react";
import axios from "axios";
import {
  AppBar, Toolbar, Container, Card, CardContent, CardMedia,
  Typography, Button, TextField, Grid
} from "@mui/material";

const API = "https://mini-event-platform-backend-new.onrender.com/api";

function App() {
  // Auth state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");

  // Events
  const [events, setEvents] = useState([]);

  // Create event form
  const [form, setForm] = useState({
    title: "",
    description: "",
    dateTime: "",
    location: "",
    capacity: "",
    imageUrl: ""
  });

  // Load events
  const loadEvents = async () => {
    const res = await axios.get(`${API}/events`);
    setEvents(res.data);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // REGISTER
  const register = async () => {
    try {
      await axios.post(`${API}/auth/signup`, {
        name,
        email,
        password
      });
      alert("Registered successfully. Now login.");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  // LOGIN
  const login = async () => {
    try {
      const res = await axios.post(`${API}/auth/login`, {
        email,
        password
      });
      setToken(res.data.token);
      setIsLoggedIn(true);
      alert("Login successful");
    } catch {
      alert("Login failed");
    }
  };

  // CREATE EVENT
  const createEvent = async () => {
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
    } catch {
      alert("Failed to create event");
    }
  };

  // RSVP
  const rsvp = async (id) => {
    try {
      await axios.post(
        `${API}/events/${id}/rsvp`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadEvents();
    } catch (err) {
      alert(err.response?.data?.message || "RSVP failed");
    }
  };

  // DELETE EVENT
  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await axios.delete(
        `${API}/events/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadEvents();
    } catch {
      alert("Delete failed");
    }
  };

  // EDIT EVENT
  const editEvent = async (event) => {
    const newTitle = prompt("New title", event.title);
    if (!newTitle) return;

    try {
      await axios.put(
        `${API}/events/${event._id}`,
        { title: newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadEvents();
    } catch {
      alert("Edit failed");
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4">Mini Event Platform</Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          A simple platform to create events and manage RSVPs.
        </Typography>

        {/* AUTH SECTION */}
        {!isLoggedIn && (
          <Card sx={{ mb: 4, p: 3 }}>
            <Typography variant="h6">Register / Login</Typography>

            <TextField
              label="Name"
              fullWidth
              sx={{ mt: 2 }}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              label="Email"
              fullWidth
              sx={{ mt: 2 }}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              sx={{ mt: 2 }}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              onClick={register}
            >
              Register
            </Button>

            <Button
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={login}
            >
              Login
            </Button>
          </Card>
        )}

        {/* CREATE EVENT */}
        {isLoggedIn && (
          <Card sx={{ mb: 5, p: 3 }}>
            <Typography variant="h5">Create Event</Typography>

            {["title", "description", "dateTime", "location", "capacity", "imageUrl"].map((field) => (
              <TextField
                key={field}
                label={field}
                fullWidth
                sx={{ mt: 2 }}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              />
            ))}

            <Button variant="contained" sx={{ mt: 2 }} onClick={createEvent}>
              Create Event
            </Button>
          </Card>
        )}

        {/* EVENTS LIST */}
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

                  {isLoggedIn && (
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ mt: 2 }}
                      onClick={() => rsvp(event._id)}
                    >
                      RSVP
                    </Button>
                  )}

                  {isLoggedIn && (
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
