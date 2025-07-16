import React, { useEffect, useState } from 'react';

const NguoiDungList = () => {
  const [nguoiDung, setNguoiDung] = useState([]);

  useEffect(() => {
    fetch('http://localhost:9999/nguoidung')
      .then(res => res.json())
      .then(data => setNguoiDung(data));
  }, []);

  return (
    <div>
      <h2>Danh sách người dùng</h2>
      <ul>
        {nguoiDung.map(item => (
          <li key={item.id}>{item.ten}</li>
        ))}
      </ul>
    </div>
  );
};

export default NguoiDungList;