# Mini Event Platform (MERN Stack)

A full-stack event management platform built using the MERN stack that allows users to create, view, and RSVP to events with strict capacity enforcement and concurrency-safe logic.

---

##  Live Application

Frontend (Vercel):  
https://mini-event-platform-sand.vercel.app

Backend (Render):  
https://mini-event-platform-backend.onrender.com

---

##  Tech Stack

- **Frontend:** React.js, Material UI (MUI), Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens)
- **Deployment:**  
  - Frontend: Vercel  
  - Backend: Render  

---

##  Features Implemented

### Authentication & Security
- User Signup and Login
- JWT-based stateless authentication
- Protected routes using Authorization headers

### Event Management (CRUD)
- Create events with:
  - Title
  - Description
  - Date & Time
  - Location
  - Capacity
  - Image URL
- View all upcoming events
- Edit and delete events (only by creator)

### RSVP System (Critical Business Logic)
- RSVP to events
- Leave events
- Prevent duplicate RSVPs
- Enforce maximum capacity
- Handle concurrent RSVP requests safely

### UI/UX
- Fully responsive UI (Desktop / Tablet / Mobile)
- Clean Material UI design
- Real-time updates after RSVP and event creation

---

##  RSVP Capacity & Concurrency Handling (Technical Explanation)

To prevent overbooking when multiple users attempt to RSVP simultaneously, the backend uses **atomic database updates** in MongoDB.

### Strategy Used:
- The RSVP logic uses a conditional update that:
  - Checks if the user has already RSVP’d
  - Ensures `attendeesCount < capacity`
- MongoDB performs this update atomically, ensuring only one request can increment the count when the last slot is available.

### Result:
- No race conditions
- No duplicate RSVPs
- Capacity is never exceeded, even under concurrent requests

---

##  Running the Application Locally

### Prerequisites
- Node.js
- MongoDB Atlas account
- Git

---

###  Clone the Repository
```bash
git clone https://github.com/PuttojuVenkatesh/mini-event-platform.git
cd mini-event-platform
