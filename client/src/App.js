import React, { useState } from 'react';
import './App.css'; // Include your CSS file
import Register from './Register';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';

// Home component (empty for now)
const Home = () => {
  return (
    <div>
      <h1>Welcome to the Home Page!</h1>
    </div>
  );
};

// Login component
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Use useNavigate for redirection

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("password", password);
    try {
      const response = await fetch('http://localhost:5001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          pw: password,
        }),
      });

      const data = await response.text();

      if (response.status === 200) {
        setMessage("Login successful!");
        // Redirect to home page after successful login
        navigate('/home');
      } else {
        setMessage(data);  // Show error message from the backend
      }

    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div className="login-container">
      <img src="./brand_images/better_logo.png" alt="Logo" className="login-logo" /> {/* Add your logo here */}
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="login-input"
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-input"
        />
        <div className="forgot-password">
          <a href="/forgot-password">Forgot password?</a>
        </div>
        <button type="submit" className="login-button">Sign in</button>
      </form>

      <div className="register-now">
        Not a member? <a href="/register">Register Now</a>
      </div>

      {message && <p>{message}</p>}
    </div>
  );
};

// Main App component with routing
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
