// App.js
import React, { useState, useEffect } from 'react';
import './App.css'; // Include your CSS file
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';

// Home component
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
  const navigate = useNavigate();

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
        navigate('/home'); // Redirect to home page after successful login
      } else {
        setMessage(data);  // Show error message from the backend
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div className="login-container">
      <img src="./brand_images/better_logo.png" alt="Logo" className="login-logo" />
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

// Register component
const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

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
      <h1>Register</h1>
      <form className="register-form" onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          className="register-input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="register-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="register-input"
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
          className="register-input"
        />
        <button type="submit" className="register-button">Register</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

// UserProfile component
// UserProfile component
const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use useNavigate for redirection

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5001/auth/user/1'); // Replace '1' with dynamic user ID if available
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = () => {
    // Optional: Clear session or token here if applicable
    navigate('/'); // Redirect to the login page
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <div className="profile-avatar">
        <img src="./default-avatar.png" alt="Avatar" className="profile-image" />
      </div>
      <div className="profile-info">
        <h3>{user.user_name || 'Guest'}</h3>
        <p><strong>Bio:</strong> {user.bio || 'Hi there!'}</p>
        <p><strong>Email:</strong> {user.email_address || 'No email'}</p>
        <p><strong>Groups Signed Up:</strong> {user.groups ? user.groups.join(', ') : 'Sign in to add groups'}</p>
      </div>
      <button className="sign-out-button" onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};


// Groups component
const Groups = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch('http://localhost:5001/auth/groups');
        const data = await response.json();
        setGroups(data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();
  }, []);

  return (
    <div className="groups-page">
      <h2>Groups</h2>
      <div className="groups-grid">
        {groups.map((group) => (
          <Link to={`/groups/${group.gid}`} key={group.gid} className="group-card">
            <img
              src={group.group_image}
              alt={group.group_name}
              className="group-image"
              loading="lazy"
            />
            <p className="group-name">{group.group_name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};


// GroupDetail component
const GroupDetail = () => {
  const { gid } = useParams(); // Get the group ID from the URL
  const [group, setGroup] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await fetch(`http://localhost:5001/auth/groups/${gid}`);
        const data = await response.json();
        setGroup(data);
      } catch (error) {
        console.error("Error fetching group:", error);
      }
    };

    fetchGroup();
  }, [gid]);

  if (!group) {
    return <p>Loading...</p>;
  }

  return (
    <div className="group-detail-page">
      <button onClick={() => navigate(-1)} className="back-button">←</button>
      <h2 className="group-title">{group.group_name}</h2>
      <div className="group-content">
        <img src={group.group_image} alt={group.group_name} className="group-detail-image" />
        <div className="group-info">
          <p><strong>Leader:</strong> {group.leader}</p>
          <p><strong>Date and Time:</strong> {group.date}, {group.time}</p>
          <p><strong>Description:</strong> {group.description}</p>
        </div>
      </div>
      <button className="join-button">Join {group.group_name}</button>
    </div>
  );
};


// MyGroups component
const MyGroups = () => {
  return (
    <div className="my-groups">
      <h2>My Groups</h2>
      <p>Here is where your signed-up groups will be listed.</p>
    </div>
  );
};

// Resources component
const Resources = () => {
  return (
    <div className="resources">
      <h2>Resources</h2>
      <p>Find helpful resources here.</p>
    </div>
  );
};

// Navbar component
const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/home">Home</Link>
      <Link to="/user">Profile</Link>
      <Link to="/mygroups">My Groups</Link>
      <Link to="/groups">Groups</Link>
      <Link to="/resources">Resources</Link>
    </nav>
  );
};

// Main App component with routing
function App() {
  return (
    <Router>
      <Navbar /> {/* Add the Navbar component here */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<UserProfile />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/groups/:gid" element={<GroupDetail />} />
        <Route path="/mygroups" element={<MyGroups />} />
        <Route path="/resources" element={<Resources />} />
      </Routes>
    </Router>
  );
}

export default App;
