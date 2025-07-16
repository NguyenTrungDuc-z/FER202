import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Vui lòng điền đầy đủ thông tin!');
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
        const storage = rememberMe ? localStorage : sessionStorage;

        // Lưu thông tin người dùng
        storage.setItem('user-info', JSON.stringify(user));
        storage.setItem('userId', user.id);

        // Kiểm tra nếu có redirectPostId thì chuyển tới bài viết đó
        const redirectPostId = localStorage.getItem("redirectPostId");
        if (redirectPostId) {
          localStorage.removeItem("redirectPostId");
          navigate(`/post/${redirectPostId}`);
        } else {
          navigate(user.role === 'admin' ? '/admin' : '/');
        }
      } else {
        setError('Sai tài khoản hoặc mật khẩu!');
      }
    } catch (error) {
      setError('Không thể kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
      <div className="card shadow p-4 w-100" style={{ maxWidth: '400px' }}>
        <h3 className="mb-4 text-center text-primary">🔐 Đăng nhập</h3>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Tên đăng nhập</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-control"
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                id="rememberMe"
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Nhớ mật khẩu
              </label>
            </div>
            <Link to="/forgot-password" className="text-decoration-none small">
              Quên mật khẩu?
            </Link>
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="mt-3 text-center">
          <p className="mb-0">
            Bạn chưa có tài khoản?{' '}
            <Link to="/register" className="text-decoration-none fw-bold">
              Đăng ký
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
