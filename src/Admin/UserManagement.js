import React, { useEffect, useState } from 'react';
import './UserManagement.css';
import Sidebar from '../Sidebar/Sidebar';

function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:9999/nguoidung')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const updatedStatus = currentStatus === 1 ? 0 : 1;

    await fetch(`http://localhost:9999/nguoidung/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trang_thai: updatedStatus })
    });

    setUsers(prev =>
      prev.map(user =>
        user.id === id ? { ...user, trang_thai: updatedStatus } : user
      )
    );
  };

  return (
    <div className="user-management">
        <Sidebar/>
      <h2>Quản lý người dùng</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.ten}</td>
              <td className={u.trang_thai === 1 ? 'active' : 'banned'}>
                {u.trang_thai === 1 ? 'Hoạt động' : 'Bị cấm'}
              </td>
              <td>
                   <button
                        className={u.trang_thai === 1 ? 'cam' : 'mo'}
                         onClick={() => toggleStatus(u.id, u.trang_thai)}
                    >
                        {u.trang_thai === 1 ? 'Cấm' : 'Mở'}
</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
