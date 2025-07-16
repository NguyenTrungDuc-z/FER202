import React, { useEffect, useState } from 'react';

const TheLoaiList = () => {
  const [theLoai, setTheLoai] = useState([]);

  useEffect(() => {
    fetch('http://localhost:9999/theloai')
      .then(res => res.json())
      .then(data => setTheLoai(data));
  }, []);

  return (
    <div>
       
      <h2>Danh sách thể loại</h2>
      <ul>
        {theLoai.map(item => (
          <li key={item.id}>{item.ten}</li>
        ))}
      </ul>
    </div>
  );
};

export default TheLoaiList;