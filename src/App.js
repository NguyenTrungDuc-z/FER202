import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";

import Login from "./component/Login";
import Register from "./component/Register";
import ChangePassword from "./component/ChangePassword";
import HomePage from "./Home/HomePage";
import Header from "./Home/Header";
import Footer from "./Home/Footer";
import Profile from "./Users/Profile";
import PostDetail from "./Home/PostDetail";
import "bootstrap-icons/font/bootstrap-icons.css";
import ForgotPassword from "./component/ForgotPassword";
import ResetPassword from "./component/ResetPassword";

// Layout dùng chung cho các route có Header/Footer
function AppLayout() {
  const location = useLocation();
  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!isAuthPage && <Header />}
      <Outlet />
      {!isAuthPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout chính dùng cho các trang sau đăng nhập */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="profile" element={<Profile />} />
          <Route path="post/:id" element={<PostDetail />} />
        </Route>

        {/* Trang không dùng layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:id" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
