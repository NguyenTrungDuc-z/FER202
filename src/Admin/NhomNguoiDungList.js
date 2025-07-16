import React, { useEffect, useState } from 'react';

const NhomNguoiDungList = () => {
  const [nhom, setNhom] = useState([]);

  useEffect(() => {
    fetch('http://localhost:9999/nhomnguoidung')
      .then(res => res.json())
      .then(data => setNhom(data));
  }, []);

  return (
    <div>
      <h2>Danh sách nhóm người dùng</h2>
      <ul>
        {nhom.map(item => (
          <li key={item.id}>{item.ten}</li>
        ))}
      </ul>
    </div>
  );
};

export default NhomNguoiDungList;