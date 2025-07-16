import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import { AuthProvider } from "./contexts/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ProfilePage from "./pages/ProfilePage";
import PrivateRoute from "./components/PrivateRoute";
import AddPostPage from "./pages/AddPostPage";
import ContactPage from "./pages/ContactPage";
import PostDetail from "./pages/PostDetail";

// Tạo một component bọc định nghĩa router để dùng useLocation
const AppWrapper = () => {
  const location = useLocation();

  // Danh sách các path không cần Header/Footer
  const hideLayoutRoutes = ["/login", "/register", "/forgot"];

  const shouldHideLayout = hideLayoutRoutes.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="d-flex flex-column min-vh-100">
      {!shouldHideLayout && <Header />}
      <div className="flex-fill">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot" element={<ForgotPasswordPage />} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/add-post" element={<PrivateRoute><AddPostPage /></PrivateRoute>} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/post/:id" element={<PostDetail />} />
        </Routes>
      </div>
      {!shouldHideLayout && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
