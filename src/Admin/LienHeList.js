import React, { useEffect, useState } from 'react';
import './LienHeList.css';
import { FaTrash, FaClock } from 'react-icons/fa';
import Sidebar from '../Sidebar/Sidebar';

function LienHeList() {
  const [contacts, setContacts] = useState([]);

  // Tải danh sách liên hệ từ API
  useEffect(() => {
    fetch('http://localhost:9999/nguoilienhe')
      .then(res => res.json())
      .then(data => setContacts(data))
      .catch(err => {
        console.error("Lỗi khi tải danh sách liên hệ:", err);
        alert("Không thể tải dữ liệu liên hệ.");
      });
  }, []);

  // Hàm xóa liên hệ theo ID
 const deleteContact = async (id) => {
  if (!window.confirm("Bạn có chắc muốn xóa liên hệ này?")) return;

  try {
    const res = await fetch(`http://localhost:9999/nguoilienhe/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setContacts(prev => prev.filter(contact => contact.id !== id));
    } else {
      const errorText = await res.text();
      console.error("Lỗi HTTP:", res.status, errorText);
      alert("Không thể xóa. Vui lòng thử lại.");
    }
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    alert("Đã xảy ra lỗi khi xóa.");
  }
};

  return (
    <div className="contact-management">
         <Sidebar/>
      <h2>Danh sách liên hệ</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Lời nhắn</th>
            <th>Ngày gửi</th>
            <th>Xoá</th>
          </tr>
        </thead>
        <tbody>
          {contacts.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>Không có dữ liệu</td>
            </tr>
          ) : (
            contacts.map((contact, index) => (
              <tr key={contact.id}>
                <td>{index + 1}</td>
                <td>{contact.ten}</td>
                <td>{contact.email}</td>
                <td className="wrap-text">{contact.loi_nhan || contact.loinhan}</td>
                <td><FaClock /> {contact.ngay_gui || contact.ngaygui}</td>
                <td>
                  <button className="btn-delete" onClick={() => deleteContact(contact.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="contact-footer">
        <p>Hiển thị {contacts.length > 0 ? `1 đến ${contacts.length}` : 0} liên hệ</p>
      </div>
    </div>
  );
}

export default LienHeList;
