import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [rememberMe, setRememberMe] = useState(false); //  Thêm trạng thái "Nhớ mật khẩu"
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.username.trim() === '' || formData.password.trim() === '') {
      setError(' Vui lòng điền đầy đủ thông tin!');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:9999/users?username=${formData.username}&password=${formData.password}`
      );
      const users = await res.json();

      if (users.length > 0) {
        const user = users[0];

        //  Nếu nhớ mật khẩu thì lưu lâu dài, ngược lại thì dùng sessionStorage
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('user-info', JSON.stringify(user));
        storage.setItem('userId', user.id);
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        setError(' Sai tài khoản hoặc mật khẩu!');
      }
    } catch (error) {
      setError(' Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
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

        {/*  Phần "Nhớ mật khẩu" và "Quên mật khẩu" */}
        <div className="login-options">
          <label className="remember-me">
           
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
           <span>Nhớ mật khẩu</span>
            
          </label>
          <Link to="/forgot-password" className="forgot-password-link">
            Quên mật khẩu?
          </Link>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>

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
