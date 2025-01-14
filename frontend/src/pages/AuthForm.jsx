import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AuthForm.css";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  // Redirect to /myaccount if the user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/myaccount");
    }
  }, [navigate]);

  // Toggle between sign-up and login forms
  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setFormData({ name: "", email: "", password: "" });
  };

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit form data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignUp
      ? "http://localhost:3000/api/users/register"
      : "http://localhost:3000/api/users/login";

    try {
      const response = await axios.post(endpoint, formData);

      if (response.status === 200 || response.status === 201) {
        if (isSignUp) {
          alert("Registration successful! You can now log in.");
          toggleForm();
        } else {
          alert("Login successful!");
          localStorage.setItem("token", response.data.token);
          navigate("/myaccount");
        }
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          alert("This email address is already registered.");
        } else {
          alert(`Error: ${error.response.data.error}`);
        }
      } else {
        alert("An error occurred. Please try again.");
        console.error(error);
      }
    }
  };

  return (
    <div className="auth-form-container">
      <nav className="menu-bar">
        <img src="/treehouse-1@2x.png" alt="Logo" className="menu-logo" />
        <button className="menu-button" onClick={() => navigate("/")}>
          Go to Home
        </button>
      </nav>
      <h1>{isSignUp ? "Sign Up " : "Login"}</h1>
      <form onSubmit={handleSubmit}>
        {isSignUp && (
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              required
            />
          </div>
        )}
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">{isSignUp ? "Sign up" : "Sign in"}</button>
      </form>
      <div className="switch">
        {isSignUp ? (
          <p>
            Already have an account?{" "}
            <a href="#" onClick={toggleForm}>
              Sign in
            </a>
          </p>
        ) : (
          <p>
            New to Karma?{" "}
            <a href="#" onClick={toggleForm}>
              Create Account
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
