import React from 'react';
import { posts } from './component/data';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Login from './component/Login';
import Register from './component/Register';
import { Home as HomeIcon } from 'lucide-react'; // hoặc dùng emoji nếu không dùng icon

function Home() {
  return (
    <div className="container">
      <h1 className="main-title">Tin công nghệ mới</h1>
      {posts.map((post, index) => (
        <div key={index} className="post-card">
          <img src={post.photo_url} alt={post.title} className="post-image" />
          <h2 className="post-title">
            <a href={post.link} target="_blank" rel="noopener noreferrer">
              {post.title}
            </a>
          </h2>
          <p className="post-source"><strong>Nguồn:</strong> {post.source_name}</p>
          <p className="post-date"><em>{new Date(post.published_datetime_utc).toLocaleString()}</em></p>
          <p className="post-snippet">{post.snippet}</p>
        </div>
      ))}
    </div>
  );
}

function AppLayout() {
  const location = useLocation();
  const currentPath = location.pathname;
  const isAuthPage = currentPath === "/login" || currentPath === "/register";

  return (
    <>
      {/* 🔹 Hiển thị navbar khác nhau tùy theo trang */}
      {isAuthPage ? (
        <div className="back-home">
          <Link to="/" className="home-link">
            <HomeIcon size={20} style={{ marginRight: '6px' }} />
            Trang chủ
          </Link>
        </div>
      ) : (
        <nav className="navbar">
          <div className="navbar-title">Tin Công Nghệ</div>
          <div className="navbar-actions">
            <Link to="/login" className="btn">Đăng nhập</Link>
          </div>
        </nav>
      )}

      {/* 🔹 Các route */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
