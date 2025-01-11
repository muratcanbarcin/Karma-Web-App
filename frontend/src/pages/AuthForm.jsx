import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // React Router'dan useNavigate // Axios'u dahil edin
import "./AuthForm.css";



const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate(); // Yönlendirme için useNavigate



  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setFormData({ name: "", email: "", password: "" }); // Formu sıfırla
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignUp
      ? "http://localhost:3000/api/users/register"
      : "http://localhost:3000/api/users/login";

    try {
      const response = await axios.post(endpoint, formData);

      if (response.status === 200 || response.status === 201) {
        if (isSignUp) {
          alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
          toggleForm();
        } else {
          alert("Giriş başarılı!");

           localStorage.setItem("token", response.data.token);
            // Kullanıcıyı /myaccount sayfasına yönlendir
           navigate("/myaccount");
           

        }
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          alert("Bu e-posta adresi zaten kayıtlı.");
        } else {
          alert(`Hata: ${error.response.data.error}`);
        }
      } else {
        alert("Bir hata oluştu. Lütfen tekrar deneyin.");
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
