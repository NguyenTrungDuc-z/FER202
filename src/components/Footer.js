import React from "react";
import { useNavigate, useLocation } from "react-router-dom"; // ⬅️ Thêm useLocation

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ⛔ Ẩn Footer nếu đang ở /profile hoặc /change-password
  const hideFooter = ["/profile", "/change-password"].includes(location.pathname);
  if (hideFooter) return null;

  return (
    <footer
      style={{ color: "#333", fontSize: "0.85rem" }}
      className="py-3 mt-4 border-top"
    >
      <div className="container">
        <div className="row gy-3 align-items-start justify-content-evenly">
          {/* Cột 1: Logo + slogan */}
          <div className="col-md-4 text-center text-md-start">
            <div
              onClick={() => navigate("/")}
              className="fw-bold text-danger"
              style={{ cursor: "pointer", fontSize: "1rem", marginLeft: "50px" }}
            >
              HTĐ <span className="text-primary">Blog</span>
            </div>
            <div className="text-muted">Blog hay – hấp dẫn – đáng tin.</div>
          </div>

          {/* Cột 2: Thông tin liên hệ */}
          <div className="col-md-4 text-center text-md-end text-muted">
            <div>📍 Hà Nội</div>
            <div>📧 htdblog@gmail.vn</div>
            <div className="mt-2">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/vuong.giang.truong?locale=vi_VN"
                target="_blank"
                rel="noopener noreferrer"
                className="me-2 text-decoration-none"
              >
                <i className="bi bi-facebook fs-4 text-primary"></i>
              </a>

              {/* Zalo */}
              <a
                href="https://zalo.me/0367689319"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none text-dark fw-bold"
              >
                📱 0367689319
              </a>
            </div>
          </div>
        </div>

        <div className="text-center text-muted small mt-3">
          &copy; {new Date().getFullYear()} HTĐ Blog. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;