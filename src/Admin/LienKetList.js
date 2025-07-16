import React, { useEffect, useState } from 'react';

const LienKetList = () => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:9999/linktohop')
      .then(res => res.json())
      .then(data => setLinks(data));
  }, []);

  return (
    <div>
      <h2>Danh sách liên kết</h2>
      <ul>
        {links.map(item => (
          <li key={item.id}>{item.ten}</li>
        ))}
      </ul>
    </div>
  );
};

export default LienKetList;