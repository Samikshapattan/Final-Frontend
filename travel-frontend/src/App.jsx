import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import Packages from "./components/Packages";
import GroupChat from "./components/GroupChat";
import Payment from "./components/Payment";
import axios from "./api/axiosConfig";
import './App.css';
// In your App.js or wherever you render Packages
import ErrorBoundary from './components/ErrorBoundary';

// In your routes:


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const response = await axios.get("/me");
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/logout");
      setUser(null);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="main-content">
       <Routes>
  <Route path="/" element={<Navigate to="/packages" />} />
  <Route 
    path="/login" 
    element={user ? <Navigate to="/packages" /> : <Login setUser={setUser} />} 
  />
  <Route 
    path="/register" 
    element={user ? <Navigate to="/packages" /> : <Register />} 
  />
  <Route 
    path="/packages" 
    element={
      <ErrorBoundary>
        <Packages user={user} />
      </ErrorBoundary>
    } 
  />
  <Route 
    path="/payment/:packageId" 
    element={
      user?.roles?.some(r => r.authority === "USER") ? 
        <Payment /> : 
        <Navigate to="/packages" />
    } 
  />
  <Route
    path="/chat"
    element={
      user?.roles?.some(r => r.authority === "USER") ? 
        <GroupChat user={user} /> : 
        <Navigate to="/packages" />
    }
  />
</Routes>

      </div>
    </Router>
  );
}

export default App;