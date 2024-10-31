import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Include your CSS file

const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Use useNavigate for redirection

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: userName,
          email_address: email,
          pw: password,
          age: age,
        }),
      });

      const data = await response.text();

      if (response.status === 200) {
        setMessage("Registration successful! Please log in.");
        // Redirect to login page after successful registration
        navigate('/home');
      } else {
        setMessage(data); // Show error message from the backend
      }

    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div className="register-container">
      <img src="./brand_images/better_logo.png" alt="Logo" className="register-logo" /> {/* Add your logo here */}
      <h1>Please enter your information below:</h1>
      <h2> </h2>
      <form className="register-form" onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          className="register-input"
        />
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="register-input"
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="register-input"
        />
        <input
          type="number"
          placeholder="age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
          className="register-input"
        />
        <h2></h2>
        <button type="submit" className="register-button">Register</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Register;
