import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef();
  const megaMenuRef = useRef();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [categories, setCategories] = useState([]);

  const { currentUser, logout } = useAuth();

  const hiddenPaths = ["/profile", "/change-password"];
  const hideNavbarBottom = hiddenPaths.includes(location.pathname);

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
      .then((data) => setCategories(data));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header>
      {/* TOP NAV */}
      <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm py-2">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <span
            className="navbar-brand fw-bold text-danger"
            style={{ fontSize: "1.3rem", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            HTĐ <span className="text-primary">Blog</span>
          </span>

          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => navigate("/contact")}
            >
              Liên hệ
            </button>

            {currentUser ? (
              <div className="position-relative" ref={dropdownRef}>
                <img
                  src={currentUser.avatar || "/macdinh.png"}
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="rounded-circle border"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowDropdown(!showDropdown)}
                />
                {showDropdown && (
                  <div
                    className="dropdown-menu show"
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "110%",
                      zIndex: 9999,
                    }}
                  >
                    <button
                      className="dropdown-item"
                      onClick={() => {
                        navigate("/profile");
                        setShowDropdown(false);
                      }}
                    >
                      Hồ sơ cá nhân
                    </button>
                    <button
                      className="dropdown-item"
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
                className="btn btn-outline-primary btn-sm rounded-pill"
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* BOTTOM NAV (Mega Menu) */}
      {!hideNavbarBottom && (
        <div
          className="container-fluid"
          style={{ backgroundColor: "#90CAF9" }} // màu xanh nhạt
        >
          <div className="d-flex justify-content-center gap-2 py-2 flex-wrap">
            <button
              className="btn btn-outline-light btn-sm fw-bold"
              onClick={() => {
                navigate("/");
                window.dispatchEvent(new Event("reset-home"));
              }}
            >
              HOME
            </button>
            <button
              className="btn btn-outline-light btn-sm fw-bold"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("sort-newest"))
              }
            >
              MỚI
            </button>
            <button
              className="btn btn-outline-light btn-sm fw-bold"
              onClick={() => setShowMegaMenu(!showMegaMenu)}
            >
              CHỦ ĐỀ
            </button>
          </div>

          {showMegaMenu && (
            <div ref={megaMenuRef} className="bg-white px-4 py-3 shadow-sm">
              <div className="row">
                {categories.map((cat) => (
                  <div key={cat.id} className="col-md-4 mb-2">
                    <h6
                      className="fw-semibold"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        window.dispatchEvent(
                          new CustomEvent("filter-category", {
                            detail: cat.id,
                          })
                        );
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
