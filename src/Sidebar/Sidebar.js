import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Quản lý hệ thống</h2>
      <ul>
        <li><Link to="/">📊 Thống kê Dashboard</Link></li>
        <li><Link to="/quanlynguoidung">👤 Quản lý người dùng</Link></li>
        <li><Link to="/quanlynhom">👥 Quản lý Nhóm Người Dùng</Link></li>
        <li><Link to="/lienhe">📩 Quản lý liên hệ</Link></li>
        
      </ul>
    </div>
  );
};

export default Sidebar;
