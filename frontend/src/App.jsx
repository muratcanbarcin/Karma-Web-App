import { useEffect } from "react";
import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
} from "react-router-dom";
import Karmaacom from "./pages/Karmaacom";
import SearchForm from "./pages/SearchForm"; // Yeni eklenen SearchForm bileşeni

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
        title = "KarmaaCom";
        metaDescription = "Default meta description.";
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
      <Route path="/search" element={<SearchForm />} /> {/* Yeni rota */}
    </Routes>
  );
}
export default App;
