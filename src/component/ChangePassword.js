import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const navigate = useNavigate();

  const userId =
    localStorage.getItem('userId') || sessionStorage.getItem('userId');

  const [user, setUser] = useState(null);
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!userId) {
      setMessage('Không tìm thấy người dùng đang đăng nhập!');
      return;
    }

    fetch(`http://localhost:9999/users/${userId}`)
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(() =>
        setMessage('Không thể tải thông tin người dùng từ máy chủ!')
      );
  }, [userId]);

  const handleChange = async () => {
    if (!user) return setMessage('Không có thông tin người dùng!');

    if (current !== user.password)
      return setMessage('❌ Mật khẩu hiện tại không đúng!');

    if (newPass.length < 6)
      return setMessage('❌ Mật khẩu mới phải có ít nhất 6 ký tự!');

    if (newPass !== confirmPass)
      return setMessage('❌ Xác nhận mật khẩu không khớp!');

    try {
      const res = await fetch(`http://localhost:9999/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPass }),
      });

      if (res.ok) {
        setMessage('✅ Đổi mật khẩu thành công!');
        setCurrent('');
        setNewPass('');
        setConfirmPass('');
        setTimeout(() => navigate('/'), 1500);
      } else {
        setMessage('❌ Lỗi khi cập nhật mật khẩu!');
      }
    } catch (error) {
      setMessage('❌ Không thể kết nối tới máy chủ!');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow-sm p-4" style={{ width: '100%', maxWidth: '450px' }}>
        <h3 className="mb-4 text-center text-primary">🔒 Đổi mật khẩu</h3>

        <div className="mb-3">
          <label className="form-label">Mật khẩu hiện tại</label>
          <input
            type="password"
            className="form-control"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="Nhập mật khẩu cũ"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Mật khẩu mới</label>
          <input
            type="password"
            className="form-control"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            placeholder="Nhập mật khẩu mới"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Xác nhận mật khẩu</label>
          <input
            type="password"
            className="form-control"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
          />
        </div>

        <button className="btn btn-primary w-100" onClick={handleChange}>
          Xác nhận
        </button>

        {message && (
          <div
            className={`alert mt-3 ${
              message.startsWith('✅') ? 'alert-success' : 'alert-danger'
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;
