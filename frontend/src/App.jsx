import { useEffect } from "react";
import { Routes, Route, useNavigationType, useLocation, Navigate } from "react-router-dom";
import Karmaacom from "./pages/Karmaacom";
import SearchForm from "./pages/SearchForm";
import AccommodationDetails from "./pages/AccommodationDetails";
import AuthForm from "./pages/AuthForm";
import MyAccount from "./pages/MyAccount";
import AddAccommodation from "./pages/AddAccommodation";
import EditAccommodation from "./pages/EditAccommodation";
import UserProfile from "./pages/UserProfile";
import { jwtDecode } from "jwt-decode"; // For decoding JWT tokens

// Function to check if the user is authenticated
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  console.log("Debug: Token -", token);

  if (!token) {
    console.warn("Token not found. User is not logged in.");
    return false;
  }

  try {
    const decoded = jwtDecode(token);
    console.log("Debug: Decoded Token -", decoded);

    const currentTime = Date.now() / 1000; // Current time in seconds
    if (decoded.exp < currentTime) {
      console.warn("Token has expired.");
      localStorage.removeItem("token");
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error decoding token:", error);
    localStorage.removeItem("token");
    return false;
  }
};

function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  // Scroll to top on navigation
  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  // Update page title and meta description based on route
  useEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
        title = "Home Page";
        metaDescription = "Welcome to the homepage.";
        break;
      case "/search":
        title = "Search Accommodations";
        metaDescription = "Search for your desired accommodations.";
        break;
      default:
        if (pathname.startsWith("/accommodation-")) {
          title = "Accommodation Details";
          metaDescription = "View the details of the selected accommodation.";
        } else {
          title = "KarmaaCom";
          metaDescription = "Default meta description.";
        }
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<Karmaacom />} />
      <Route path="/search" element={<SearchForm />} />
      <Route path="/accommodation/:id" element={<AccommodationDetails />} />
      <Route path="/AuthForm" element={<AuthForm />} />

      <Route
        path="/MyAccount"
        element={
          isAuthenticated() ? <MyAccount /> : <Navigate to="/AuthForm" replace />
        }
      />
      <Route path="/edit-accommodation/:id" element={<EditAccommodation />} />
      <Route path="/myaccount/addaccommodations" element={<AddAccommodation />} />
      <Route path="/user/:userId" element={<UserProfile />} />
    </Routes>
  );
}

export default App;
