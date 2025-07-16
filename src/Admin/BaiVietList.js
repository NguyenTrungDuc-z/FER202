import React, { useEffect, useState } from 'react';

const BaiVietList = () => {
  const [baiViet, setBaiViet] = useState([]);

  useEffect(() => {
    fetch('http://localhost:9999/baiviet')
      .then(res => res.json())
      .then(data => setBaiViet(data));
      
  }, []);

  return (
    <div>
      <h2>Danh sách bài viết</h2>
      <ul>
        {baiViet.map(item => (
          <li key={item.id}>{item.tieu_de}</li>
        ))}
      </ul>
    </div>
  );
};

export default BaiVietList;