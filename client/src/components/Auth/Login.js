import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/login`,
        formData
      );
      console.log(response.data);
      
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user.id);
      alert(response.data.message);
      navigate("/dashboard");
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>

      </form>
      <p className="form-text">
        <a href="/forgot-password">Forgot Password?</a>
      </p>
      <p className="form-text">
        Don't have an account? <a href="/signup">Signup</a>
      </p>
    </div>
  );
};

export default Login;