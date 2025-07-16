import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstname: "",
    lastname: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const checkRes = await fetch(`http://localhost:9999/users?username=${formData.username}`);
      const existingUsers = await checkRes.json();
      if (existingUsers.length > 0) {
        setError("Tên đăng nhập đã tồn tại!");
        return;
      }

      const newUser = {
        ...formData,
        role: "user",
      };

      const res = await fetch("http://localhost:9999/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        alert("✅ Đăng ký thành công! Bạn có thể đăng nhập.");
        navigate("/login");
      } else {
        setError("Đăng ký thất bại. Vui lòng thử lại!");
      }
    } catch (err) {
      setError("Lỗi khi gửi dữ liệu. Kiểm tra lại kết nối.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="text-center mb-4">Đăng ký tài khoản</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            name="username"
            className="form-control"
            placeholder="Tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            name="firstname"
            className="form-control"
            placeholder="Họ"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            name="lastname"
            className="form-control"
            placeholder="Tên"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="tel"
            name="phone"
            className="form-control"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        {error && (
          <div className="alert alert-danger py-2 small text-center">{error}</div>
        )}

        <button type="submit" className="btn btn-primary w-100">
          Đăng ký
        </button>
      </form>

      <div className="text-center mt-3">
        <small>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </small>
      </div>
    </div>
  );
}

export default Register;
