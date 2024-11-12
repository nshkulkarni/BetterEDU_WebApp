// App.js
import React, { useState, useEffect } from 'react';
import './App.css'; // Include your CSS file
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';
import { UserProvider, useUser } from './UserContext'; // Import UserProvider and useUser


// Login component
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser(); // Get setUser function from context

  const handleLogin = async (e) => {
    e.preventDefault();
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

      const data = await response.json();

      if (response.status === 200) {
        console.log("User data received from server:", data);
        setUser(data); // Save user data in context
        setMessage("Login successful!");
        navigate('/user'); // Redirect after successful login
      } else {
        setMessage(data); // Show error message from the backend
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
        setMessage("Registration successful!");
        navigate('/user');
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
const UserProfile = () => {
  const { user } = useUser(); // Use user data from context
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user.uid) return; // Exit if user is not defined
      try {
        const response = await fetch(`http://localhost:5001/auth/user/${user.uid}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserData();
  }, [user]);

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <div className="profile-avatar">
        <img src="./default-avatar.png" alt="Avatar" className="profile-image" />
      </div>
      <div className="profile-info">
        <h3>{user.user_name || 'Guest'}</h3>
        <p><strong>Email:</strong> {user.email_address || 'No email'}</p>
      </div>
      <button className="sign-out-button" onClick={() => navigate('/')}>Sign Out</button>
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
  const { user } = useUser(); // Access user from context
  const [myGroups, setMyGroups] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.uid) return;

    const fetchMyGroups = async () => {
      try {
        const response = await fetch(`http://localhost:5001/auth/mygroups/${user.uid}`);
        if (response.status === 404) {
          setMyGroups([]);
          setError("No groups found for this user.");
          return;
        }
        const data = await response.json();
        setMyGroups(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMyGroups();
  }, [user]);

  if (!user) return <p>Please log in to view your groups.</p>;

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="groups-page">
      <h2>My Groups</h2>
      <div className="groups-grid">
        {myGroups.map((group) => (
          <Link to={`/groups/${group.gid}`} key={group.gid} className="group-card">
            <img src={group.group_image} alt={group.group_name} className="group-image" />
            <p className="group-name">{group.group_name}</p>
          </Link>
        ))}
      </div>
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
    <UserProvider>
      <Router>
        <Navbar /> {/* Add the Navbar component here */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<UserProfile />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:gid" element={<GroupDetail />} />
          <Route path="/mygroups" element={<MyGroups />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
