import { useEffect } from "react";
import { Routes, Route, useNavigationType, useLocation, Navigate } from "react-router-dom";
import Karmaacom from "./pages/Karmaacom";
import SearchForm from "./pages/SearchForm";
import AccommodationDetails from "./pages/AccommodationDetails";
import AuthForm from "./pages/AuthForm";
import MyAccount from "./pages/MyAccount";
import AddAccommodation from "./pages/AddAccommodation";
import EditAccommodation from "./pages/EditAccommodation";
import {jwtDecode} from "jwt-decode"; // JWT token'ı doğrulamak için

// Kullanıcının giriş yapıp yapmadığını kontrol eden bir fonksiyon
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  console.log("Debug: Token -", token); // Debug için token'ı yazdır

  if (!token) {
    console.warn("Token bulunamadı, kullanıcı giriş yapmamış.");
    return false;
  }

  try {
    const decoded = jwtDecode(token);
    console.log("Debug: Decoded Token -", decoded); // Debug için çözülmüş token'ı yazdır

    const currentTime = Date.now() / 1000; // Şu anki zaman (saniye cinsinden)
    if (decoded.exp < currentTime) {
      console.warn("Token süresi dolmuş.");
      localStorage.removeItem("token"); // Geçersiz token'ı kaldır
      return false;
    }
    return true;
  } catch (error) {
    console.error("Token doğrulama hatası:", error);
    localStorage.removeItem("token"); // Hatalı token'ı kaldır
    return false;
  }
};
function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

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

      </Routes>
  );
}

export default App;
