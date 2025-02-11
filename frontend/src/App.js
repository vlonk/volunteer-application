import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup'
import Event from './pages/events';


function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
      <Route path="/" element={<Navigate replace to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      
      <Route path="/events" element={<Event />} />

      <Route path="/signup" element={<Signup />} />

      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
