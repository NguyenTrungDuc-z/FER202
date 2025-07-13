import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:9999/users?username=${formData.username}&password=${formData.password}`
      );
      const users = await res.json();

      if (users.length > 0) {
        const user = users[0];
        localStorage.setItem('user-info', JSON.stringify(user));

        // ✅ Phân quyền điều hướng
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError('❌ Sai tài khoản hoặc mật khẩu!');
      }
    } catch (error) {
      setError('❌ Lỗi kết nối đến máy chủ.');
    }
  };

  return (
    <div className="login-form-container">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label>
          Tên đăng nhập:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Mật khẩu:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Đăng nhập</button>

        <div className="register-link">
          <p>
            Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
