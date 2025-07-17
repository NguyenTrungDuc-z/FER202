import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Ẩn footer với các path không cần
  const hideFooter = ["/profile", "/change-password"].includes(location.pathname);
  if (hideFooter) return null;

  return (
    <footer style={{ backgroundColor: "#e0f7fa" }} className=" text-muted pt-4 border-top mt-5">
      <div className="container">
        <div className="row justify-content-between align-items-start gy-4">

          {/* Cột 1: Logo + slogan */}
          <div className="col-md-5 text-center text-md-start">
            <div
              onClick={() => navigate("/")}
              className="fw-bold text-danger"
              style={{ cursor: "pointer", fontSize: "1.2rem" }}
            >
              HTĐ <span className="text-primary">Blog</span>
            </div>
            <p className="mb-0 mt-1 small">Blog hay – hấp dẫn – đáng tin.</p>
          </div>

          {/* Cột 2: Thông tin liên hệ */}
          <div className="col-md-5 text-center text-md-end">
            <p className="mb-1"><i className="bi bi-geo-alt-fill text-danger"></i> Hà Nội</p>
            <p className="mb-1"><i className="bi bi-envelope-fill text-primary"></i> htdblog@gmail.vn</p>
            <div>
              <a
                href="https://www.facebook.com/vuong.giang.truong?locale=vi_VN"
                target="_blank"
                rel="noopener noreferrer"
                className="me-3 text-decoration-none"
              >
                <i className="bi bi-facebook fs-4 text-primary"></i>
              </a>
              <a
                href="https://zalo.me/0367689319"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none text-dark fw-semibold"
              >
                📱 0367689319
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-4 pb-3 small">
          &copy; {new Date().getFullYear()} HTĐ Blog. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
