import React, { useEffect, useState } from 'react';
import Sidebar from '../Sidebar/Sidebar';

const NguoiLienHeList = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:9999/nguoidienhe')
      .then(res => res.json())
      .then(data => setContacts(data));
  }, []);

  return (
    <div>
       <Sidebar/>
      <h2>Danh sách người liên hệ</h2>
      <ul>
        {contacts.map(item => (
          <li key={item.id}>{item.ten}</li>
        ))}
      </ul>
    </div>
  );
};

export default NguoiLienHeList;