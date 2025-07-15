import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user-info') || sessionStorage.getItem('user-info'));

  const savedAvatar = localStorage.getItem('user-avatar');
  const defaultAvatar = `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=0077cc&color=fff&size=100`;

  const [avatar, setAvatar] = useState(savedAvatar || defaultAvatar);
  const [preview, setPreview] = useState(null); // ảnh mới chọn chưa xác nhận

  useEffect(() => {
    // Khi người dùng xác nhận ảnh mới, lưu vào localStorage
    if (avatar) {
      localStorage.setItem('user-avatar', avatar);
    }
  }, [avatar]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // chỉ gán preview
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (preview) {
      setAvatar(preview); // chính thức cập nhật
      setPreview(null);
    }
  };

  if (!user) return <p>Bạn chưa đăng nhập.</p>;

  return (
    <div className="container profile-container">
      <h2 className="mb-4">Thông tin cá nhân</h2>

      <div className="avatar-section">
        <img
          src={preview || avatar}
          alt="Avatar"
          className="profile-avatar"
        />
        <label htmlFor="avatar-upload" className="change-avatar-label">
          Thay đổi ảnh
        </label>
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          onChange={handleAvatarChange}
          style={{ display: 'none' }}
        />
        {preview && (
          <button className="btn btn-primary mt-2" onClick={handleConfirm}>
            Xác nhận thay đổi
          </button>
        )}
      </div>

      <div className="profile-info mt-4">
        <p><strong>Tên tài khoản:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email || 'Chưa có'}</p>
        <p><strong>Họ:</strong> {user.firstname || 'Chưa có'}</p>
        <p><strong>Tên:</strong> {user.lastname || 'Chưa có'}</p>
        <p><strong>Số điện thoại:</strong> {user.phone || 'Chưa có'}</p>
      </div>
    </div>
  );
};

export default Profile;
