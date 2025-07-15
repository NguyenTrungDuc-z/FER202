import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Grid, Lock, LogOut } from 'lucide-react';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user-info') || sessionStorage.getItem('user-info'));
  const avatar = localStorage.getItem('user-avatar');
  const dropdownRef = useRef();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showBottomMenu, setShowBottomMenu] = useState(false);

  // Ẩn dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user-info');
    sessionStorage.removeItem('user-info');
    localStorage.removeItem('user-avatar');
    navigate('/login');
  };

  return (
    <header>
      {/* --- TOP HEADER --- */}
      <div className="header-top">
        <div className="logo" onClick={() => navigate('/')}>
          <span className="logo-main">TIN TỨC </span><span className="logo-accent">HÀNG NGÀY</span>
          <p className="logo-sub">Thông tin 24/24</p>
        </div>

        <div className="search-bar">
          <input type="text" placeholder="Nhập nội dung tìm kiếm" />
          <Search size={18} />
        </div>

        <div className="header-icons" ref={dropdownRef}>
          {/* Avatar + Dropdown */}
          {user && (
            <div className="user-dropdown">
              <img
                src={avatar}
                className="avatar-icon"
                alt="User"
                onClick={() => setShowDropdown(prev => !prev)}
              />
              <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
                <button
                  className="dropdown-user"
                  onClick={() => {
                    setShowDropdown(false);
                    navigate('/profile');
                  }}
                >
                  👋 {user.username}
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setShowDropdown(false);
                    navigate('/change-password');
                  }}
                >
                  <Lock size={14} style={{ marginRight: 6 }} />
                  Đổi mật khẩu
                </button>
                <button className="dropdown-item" onClick={handleLogout}>
                  <LogOut size={14} style={{ marginRight: 6 }} />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
      
        </div>
      </div>

      {/* --- BOTTOM NAVIGATION --- */}
  <div className="header-bottom">
  <nav className="main-menu">
    <button>NÓNG</button>
    <button>MỚI</button>
    <button>VIDEO</button>
    <button>CHỦ ĐỀ</button>
  </nav>

  <div className="topics">
    <span># Năng lượng tích cực</span>
    <span># Khám phá Việt Nam</span>
    <span># Khám phá Thế Giới</span>
  </div>

  <div className="menu-icon-container">
    <div className="menu-icon" onClick={() => setShowBottomMenu(prev => !prev)}>≡</div>

    {showBottomMenu && (
      <div className="bottom-dropdown">
        <button onClick={() => alert('Trang chủ')}>🏠 Trang chủ</button>
        <button onClick={() => alert('Thể thao')}>⚽ Thể thao</button>
        <button onClick={() => alert('Giải trí')}>🎬 Giải trí</button>
        <button onClick={() => alert('Kinh tế')}>💰 Kinh tế</button>
      </div>
    )}
  </div>
</div>
    </header>
  );
};

export default Header;
