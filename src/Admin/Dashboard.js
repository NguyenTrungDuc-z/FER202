import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import { FaList, FaNewspaper, FaUser, FaUsers, FaLink, FaPhone } from 'react-icons/fa';
import Sidebar from '../Sidebar/Sidebar';

function Dashboard() {
  const [counts, setCounts] = useState({
    theloai: 0,
    baiviet: 0,
    nguoidung: 0,
    nhomnguoidung: 0,
    linktohop: 0,
    nguoidienhe: 0
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [tl, bv, nd, nnd, lk, lh] = await Promise.all([
          
          fetch('http://localhost:9999/theloai').then(res => res.json()),
          fetch('http://localhost:9999/baiviet').then(res => res.json()),
          fetch('http://localhost:9999/nguoidung').then(res => res.json()),
          fetch('http://localhost:9999/nhomnguoidung').then(res => res.json()),
          fetch('http://localhost:9999/linktohop').then(res => res.json()),
          fetch('http://localhost:9999/nguoidienhe').then(res => res.json())
        ]);
        setCounts({
          theloai: tl.length,
          baiviet: bv.length,
          nguoidung: nd.length,
          nhomnguoidung: nnd.length,
          linktohop: lk.length,
          nguoidienhe: lh.length
        });
      } catch (err) {
        console.error('Lỗi khi load dữ liệu:', err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="dashboard">
      <Sidebar/>
      <h2>Thống kê hệ thống</h2>
      <div className="card-container">
        <Card label="Thể loại" icon={<FaList />} value={counts.theloai} link="/theloai" color="#4e73df" />
        <Card label="Bài viết" icon={<FaNewspaper />} value={counts.baiviet} link="/baiviet" color="#1cc88a" />
        <Card label="Người dùng" icon={<FaUser />} value={counts.nguoidung} link="/nguoidung" color="#36b9cc" />
        <Card label="Nhóm người dùng" icon={<FaUsers />} value={counts.nhomnguoidung} link="/nhomnguoidung" color="#f6c23e" />
        <Card label="Liên kết tổng hợp" icon={<FaLink />} value={counts.linktohop} link="/lienket" color="#e74a3b" />
        <Card label="Người liên hệ" icon={<FaPhone />} value={counts.nguoidienhe} link="/nguoidienhe" color="#858796" />
      </div>
    </div>
  );
}


function Card({ label, icon, value, link, color }) {
  return (
    <div className="card" style={{ backgroundColor: color }}>
      <div className="card-top">
        <div className="card-icon">{icon}</div>
        <div className="card-label">{label}</div>
      </div>
      <div className="card-value">{value}</div>
      <Link to={link} className="card-link">Chi tiết thông tin</Link>
    </div>
  );
}

export default Dashboard;
