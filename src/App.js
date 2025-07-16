import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Admin/Dashboard';
import TheLoaiList from './Admin/TheLoaiList';
import BaiVietList from './Admin/BaiVietList';
import NguoiDungList from './Admin/NguoiDungList';
import NhomNguoiDungList from './Admin/NhomNguoiDungList';
import LienKetList from './Admin/LienKetList';
import NguoiLienHeList from './Admin/NguoiLienHeList';
import UserManagement from './Admin/UserManagement';
import NhomNguoiDungManager from './Admin/NhomNguoiDungManager';
import LienHeList from './Admin/LienHeList';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/quanlynguoidung" element={<UserManagement />} />
        <Route path="/quanlynhom" element={<NhomNguoiDungManager />} />
        <Route path="/lienhe" element={<LienHeList />} />
        <Route path="/theloai" element={<TheLoaiList />} />
        <Route path="/baiviet" element={<BaiVietList />} />
        <Route path="/nguoidung" element={<NguoiDungList />} />
        <Route path="/nhomnguoidung" element={<NhomNguoiDungList />} />
        <Route path="/lienket" element={<LienKetList />} />
        <Route path="/nguoidienhe" element={<NguoiLienHeList />} />
      </Routes>
    </Router>
  );
}

export default App;
