import React, { useState, useEffect } from 'react';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user-info') || sessionStorage.getItem('user-info'));

  const savedAvatar = localStorage.getItem('user-avatar');
  const defaultAvatar = `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=0077cc&color=fff&size=100`;

  const [avatar, setAvatar] = useState(savedAvatar || defaultAvatar);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (avatar) {
      localStorage.setItem('user-avatar', avatar);
    }
  }, [avatar]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (preview) {
      setAvatar(preview);
      setPreview(null);
    }
  };

  if (!user) return <div className="container mt-5 alert alert-warning">Bạn chưa đăng nhập.</div>;

  return (
    <div className="container mt-5" style={{ maxWidth: '600px' }}>
      <h3 className="mb-4 text-center">👤 Thông tin cá nhân</h3>

      <div className="text-center mb-4">
        <img
          src={preview || avatar}
          alt="Avatar"
          className="rounded-circle border"
          style={{ width: '120px', height: '120px', objectFit: 'cover' }}
        />
        <div className="mt-2">
          <label htmlFor="avatar-upload" className="btn btn-outline-primary btn-sm">
            Thay đổi ảnh
          </label>
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: 'none' }}
          />
        </div>
        {preview && (
          <button className="btn btn-primary btn-sm mt-2" onClick={handleConfirm}>
            Xác nhận thay đổi
          </button>
        )}
      </div>

      <div className="card p-3 shadow-sm">
        <div className="mb-2">
          <strong>Tên đăng nhập:</strong> {user.username}
        </div>
        <div className="mb-2">
          <strong>Email:</strong> {user.email || <span className="text-muted">Chưa có</span>}
        </div>
        <div className="mb-2">
          <strong>Họ:</strong> {user.firstname || <span className="text-muted">Chưa có</span>}
        </div>
        <div className="mb-2">
          <strong>Tên:</strong> {user.lastname || <span className="text-muted">Chưa có</span>}
        </div>
        <div className="mb-2">
          <strong>Số điện thoại:</strong> {user.phone || <span className="text-muted">Chưa có</span>}
        </div>
      </div>
    </div>
  );
};

export default Profile;
