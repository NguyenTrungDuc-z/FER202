import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Badge } from "react-bootstrap";

export default function ContactManager() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:9999/contacts").then(res => setContacts(res.data));
  }, []);

  const markAsHandled = async (id) => {
    await axios.patch(`http://localhost:9999/contacts/${id}`, { status: 1 });
    setContacts(contacts.map(c => c.id === id ? { ...c, status: 1 } : c));
  };

  return (
    <div>
      <h4 className="mb-3">Quản lý liên hệ</h4>
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Người gửi</th>
            <th>Email</th>
            <th>Nội dung</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.message}</td>
              <td>
                {c.status === 1 ? <Badge bg="success">Đã xử lý</Badge> : <Badge bg="warning">Chưa xử lý</Badge>}
              </td>
              <td>
                {c.status === 0 && (
                  <Button variant="success" size="sm" onClick={() => markAsHandled(c.id)}>
                    Đánh dấu đã xử lý
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
