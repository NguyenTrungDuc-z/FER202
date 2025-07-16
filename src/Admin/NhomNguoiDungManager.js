import React, { useEffect, useState } from 'react';
import './NhomNguoiDungManager.css';
import Sidebar from '../Sidebar/Sidebar';

function NhomNguoiDungManager() {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetch('http://localhost:9999/nhomnguoidung')
      .then(res => res.json())
      .then(data => setGroups(data));
  }, []);

  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    fetch(`http://localhost:9999/nhomnguoidung/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trang_thai: newStatus })
    })
      .then(() => {
        setGroups(prev =>
          prev.map(g =>
            g.id === id ? { ...g, trang_thai: newStatus } : g
          )
        );
      });
  };

  return (
    <div className="group-management">
        <Sidebar/>
      <h2>Quản lý Nhóm Người Dùng</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên nhóm</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {groups.map(g => (
            <tr key={g.id}>
              <td>{g.id}</td>
              <td>{g.ten}</td>
              <td className={g.trang_thai === 1 ? 'active' : 'banned'}>
                {g.trang_thai === 1 ? 'Hoạt động' : 'Bị cấm'}
              </td>
              <td>
                <button
                  className={g.trang_thai === 1 ? 'cam' : 'mo'}
                  onClick={() => toggleStatus(g.id, g.trang_thai)}
                >
                  {g.trang_thai === 1 ? 'Cấm' : 'Mở'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default NhomNguoiDungManager;
