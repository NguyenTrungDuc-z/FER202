import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!username.trim()) {
      setError('Vui lòng nhập tên đăng nhập');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:9999/users?username=${username}`);
      if (res.data.length === 0) {
        setError('Tên đăng nhập không tồn tại');
      } else {
        // Tạm thời bỏ qua gửi mail, chuyển sang trang đổi mật khẩu
        // Truyền id user qua URL để đổi mật khẩu
        navigate(`/reset-password/${res.data[0].id}`);
      }
    } catch {
      setError('Lỗi kết nối đến máy chủ');
    }
    setLoading(false);
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
      <h2 className="mb-4">Quên mật khẩu</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {info && <div className="alert alert-info">{info}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Tên đăng nhập</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Gửi yêu cầu'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
