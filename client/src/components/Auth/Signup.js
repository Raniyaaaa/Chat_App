import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/signup`, { username, email, password, number });
      alert("Signup successful! Please login.");
      navigate("/");
    } catch (error) {
      alert("Signup failed.");
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <input type="number" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Phone Number" required />
        <button type="submit">Signup</button>
        <p>Already have an account? <a href="/">Login</a></p>
      </form>
    </div>
  );
};

export default Signup;
