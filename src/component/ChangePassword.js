import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Thêm dòng này
import './ChangePassword.css';

const ChangePassword = () => {
  const navigate = useNavigate(); // ✅ Khởi tạo hàm điều hướng

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
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => setUser(data))
      .catch(() =>
        setMessage('Không thể tải thông tin người dùng từ máy chủ!')
      );
  }, [userId]);

  const handleChange = async () => {
    if (!user) {
      setMessage('Không có thông tin người dùng!');
      return;
    }

    if (current !== user.password) {
      setMessage('Mật khẩu hiện tại không đúng!');
      return;
    }

    if (newPass.length < 6) {
      setMessage('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    if (newPass !== confirmPass) {
      setMessage('Xác nhận mật khẩu không khớp!');
      return;
    }

    try {
      const res = await fetch(`http://localhost:9999/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPass })
      });

      if (res.ok) {
        setMessage('✅ Đổi mật khẩu thành công!');

        // ✅ Reset form
        setCurrent('');
        setNewPass('');
        setConfirmPass('');

        // ✅ Chờ 1.5s rồi chuyển về trang chủ
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setMessage('Lỗi khi cập nhật mật khẩu!');
      }
    } catch (error) {
      setMessage('Không thể kết nối tới máy chủ!');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h2 className="mb-4">Đổi mật khẩu</h2>

      <input
        type="password"
        className="form-control mb-3"
        placeholder="Mật khẩu hiện tại"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
      />

      <input
        type="password"
        className="form-control mb-3"
        placeholder="Mật khẩu mới"
        value={newPass}
        onChange={(e) => setNewPass(e.target.value)}
      />

      <input
        type="password"
        className="form-control mb-3"
        placeholder="Xác nhận mật khẩu mới"
        value={confirmPass}
        onChange={(e) => setConfirmPass(e.target.value)}
      />

      <button-ChangePassword className="btn btn-primary w-100" onClick={handleChange}>
        Xác nhận
      </button-ChangePassword>

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
  );
};

export default ChangePassword;
