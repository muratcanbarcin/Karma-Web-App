import { useEffect } from "react";
import { Routes, Route, useNavigationType, useLocation } from "react-router-dom";
import Karmaacom from "./pages/Karmaacom";
import SearchForm from "./pages/SearchForm";
import AccommodationDetails from "./pages/AccommodationDetails";
import AuthForm from "./pages/AuthForm";


function App() {
  // React Router Hooks
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  // Scroll to top when navigation occurs
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

  // Application Routes
  return (
    <Routes>
      <Route path="/" element={<Karmaacom />} />
      <Route path="/search" element={<SearchForm />} />
      <Route path="/accommodation-:id" element={<AccommodationDetails />} />
      <Route path="/AuthForm" element={<AuthForm />} /> {/* Yeni rota */}

    </Routes>
  );
}

export default App;
