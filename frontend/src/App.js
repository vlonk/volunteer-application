import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup'
import Event from './pages/events';
import NavBar from './pages/navbar';
import Profile from './pages/profile'
import History from './pages/history'
import Notifications from './pages/notifications'
import EventsManagement from './pages/events_management';


function App() {
  return (
    <BrowserRouter>
    
    <NavBar />
    <div className="App">
      <Routes>
      <Route path="/" element={<Navigate replace to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/user/:id/events" element={<History />} />
      <Route path="/notifications/:id" element={<Notifications />} />
      <Route path="/events" element={<Event />} />
      <Route path="/events_management" element={<EventsManagement/>} />
      <Route path="/signup" element={<Signup />} />

      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
