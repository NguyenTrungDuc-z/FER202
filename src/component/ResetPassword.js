import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:9999/users/${id}`)
      .then(res => setUser(res.data))
      .catch(() => setError('Người dùng không tồn tại'));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newPassword || !confirmNewPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    setLoading(true);
    try {
      await axios.patch(`http://localhost:9999/users/${id}`, {
        password: newPassword,
      });
      setSuccess('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      setError('Có lỗi xảy ra, vui lòng thử lại');
    }
    setLoading(false);
  };

  if (error) return <p className="text-danger">{error}</p>;
  if (!user) return <p>Đang tải...</p>;

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '50px' }}>
      <h2 className="mb-4">Đặt mật khẩu mới cho: {user.username}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Mật khẩu mới</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <div className="mb-3">
          <label>Xác nhận mật khẩu mới</label>
          <input
            type="password"
            className="form-control"
            value={confirmNewPassword}
            onChange={e => setConfirmNewPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
