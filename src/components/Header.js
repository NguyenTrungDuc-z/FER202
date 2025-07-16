// src/components/Header.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Lock, LogOut } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const megaMenuRef = useRef();
  const dropdownRef = useRef();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [categories, setCategories] = useState([]);

  const { currentUser, logout } = useAuth();

  useEffect(() => {
    document.addEventListener("mousedown", (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target)) {
        setShowMegaMenu(false);
      }
    });
  }, []);

  useEffect(() => {
    fetch("http://localhost:9999/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Lỗi khi tải categories:", err));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const hiddenPaths = ["/profile", "/change-password"];
  const hideNavbarBottom = hiddenPaths.includes(location.pathname);

  return (
    <header>
      <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm py-2">
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

          <div className="d-flex gap-2 align-items-center">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => navigate("/contact")}
            >
              Liên hệ
            </button>

            {currentUser ? (
              <div className="position-relative" ref={dropdownRef}>
                <img
                  src={currentUser.avatar || "/macdinh.png"}
                  className="rounded-circle"
                  alt="avatar"
                  width={32}
                  height={32}
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{ cursor: "pointer", border: "1px solid #ccc" }}
                />

                {showDropdown && (
                  <div
                    className="dropdown-menu show"
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "110%",
                      zIndex: 9999,
                      display: "block",
                      minWidth: "160px",
                      padding: "0.5rem",
                    }}
                  >
                    <button
                      className="dropdown-item d-flex align-items-center gap-2"
                      onClick={() => {
                        navigate("/profile");
                        setShowDropdown(false);
                      }}
                    >
                      Hồ sơ cá nhân
                    </button>
                    
                    <button
                      className="dropdown-item d-flex align-items-center gap-2"
                      onClick={() => {
                        handleLogout();
                        setShowDropdown(false);
                      }}
                    >
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

            <button
              className="btn btn-sm btn-outline-light fw-bold"
              onClick={() => setShowMegaMenu(!showMegaMenu)}
            >
              CHỦ ĐỀ
            </button>
          </div>

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
}
