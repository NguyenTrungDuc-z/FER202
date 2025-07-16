// Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, LogOut } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef();
  const megaMenuRef = useRef();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [categories, setCategories] = useState([]);

  const user = JSON.parse(
    localStorage.getItem("user-info") || sessionStorage.getItem("user-info")
  );
  const avatar = localStorage.getItem("user-avatar");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target)) {
        setShowMegaMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetch("http://localhost:9999/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Lỗi khi load categories:", err));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const hiddenPaths = ["/profile", "/change-password"];
  const hideNavbarBottom = hiddenPaths.includes(location.pathname);

  return (
    <header>
      <nav
        className="navbar navbar-expand-lg bg-white border-bottom shadow-sm py-2"
        style={{ minHeight: "70px" }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center me-2">
            <span
              className="navbar-brand fw-bold text-danger mb-0"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer", fontSize: "1.3rem", lineHeight: "1" }}
            >
              HTĐ <span className="text-primary">Blog</span>
            </span>
          </div>

          <div ref={dropdownRef} className="ms-2">
            {user ? (
              <div className="dropdown">
                <img
                  src={avatar || "https://i.pravatar.cc/150?u=default"}
                  className="rounded-circle"
                  alt="avatar"
                  width={32}
                  height={32}
                  onClick={() => setShowDropdown((prev) => !prev)}
                  style={{ cursor: "pointer", border: "1px solid #ccc" }}
                />
                {showDropdown && (
                  <div className="dropdown-menu dropdown-menu-end show mt-1 p-2 bg-light">
                    <button
                      className="dropdown-item py-1 px-3"
                      onClick={() => navigate("/profile")}
                    >
                      👋 {user.username}
                    </button>
                    <button
                      className="dropdown-item py-1 px-3 d-flex align-items-center"
                      onClick={() => navigate("/change-password")}
                    >
                      <Lock size={14} className="me-2" />
                      Đổi mật khẩu
                    </button>
                    <button
                      className="dropdown-item py-1 px-3 d-flex align-items-center"
                      onClick={handleLogout}
                    >
                      <LogOut size={14} className="me-2" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="btn btn-outline-primary btn-sm rounded-pill px-3"
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </nav>

      {!hideNavbarBottom && (
        <div className="container-fluid bg-primary shadow-sm py-2 px-2 mt-2 border-top border-primary border-opacity-25">
          <div className="d-flex align-items-center justify-content-center flex-wrap gap-2">
            <div className="d-flex gap-1 flex-wrap">
              <button
                className="btn btn-sm btn-outline-light fw-bold"
                onClick={() => {
                  navigate("/");
                  window.dispatchEvent(new Event("reset-home"));
                }}
              >
                HOME
              </button>
              <button
                className="btn btn-sm btn-outline-light fw-bold"
                onClick={() => {
                  const event = new CustomEvent("sort-newest");
                  window.dispatchEvent(event);
                }}
              >
                MỚI
              </button>
            </div>

            {/* Nút CHỦ ĐỀ */}
            <div>
              <button
                className="btn btn-sm btn-outline-light fw-bold"
                onClick={() => setShowMegaMenu((prev) => !prev)}
              >
                CHỦ ĐỀ
              </button>
            </div>
          </div>

          {/* Mega Menu */}
          {showMegaMenu && (
            <div
              ref={megaMenuRef}
              className="bg-light p-3 border-top shadow-sm mt-0"
            >
              <div className="row">
                {categories.map((cat) => (
                  <div key={cat.id} className="col-md-4 mb-2">
                    <h6
                      className="text-dark fw-semibold"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        const event = new CustomEvent("filter-category", {
                          detail: cat.id,
                        });
                        window.dispatchEvent(event);
                        setShowMegaMenu(false);
                      }}
                    >
                      📝 {cat.name}
                    </h6>
                    <p className="text-muted small">{cat.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
