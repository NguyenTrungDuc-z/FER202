import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { Link } from "react-router-dom";

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
      // Kiểm tra username đã tồn tại
      const checkRes = await fetch(`http://localhost:9999/users?username=${formData.username}`);
      const existingUsers = await checkRes.json();
      if (existingUsers.length > 0) {
        setError("Tên đăng nhập đã tồn tại!");
        return;
      }

      // Gửi POST đăng ký với role mặc định là 'user'
      const newUser = {
        ...formData,
        role: "user", // ✅ Thêm role mặc định ở đây
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
    <div className="form-container">
      <h2>Đăng ký tài khoản</h2>
      <form onSubmit={handleSubmit} className="form">
        <input type="text" name="username" placeholder="Tên đăng nhập" value={formData.username} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Mật khẩu" value={formData.password} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="firstname" placeholder="Họ" value={formData.firstname} onChange={handleChange} required />
        <input type="text" name="lastname" placeholder="Tên" value={formData.lastname} onChange={handleChange} required />
        <input type="tel" name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} required />

        {error && <p className="error">{error}</p>}

        <button type="submit">Đăng ký</button>
      </form>
      <p style={{ marginTop: "10px" }}>
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
    </div>
  );
}

export default Register;
