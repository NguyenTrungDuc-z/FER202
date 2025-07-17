import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Badge } from "react-bootstrap";

export default function UserManager() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:9999/users").then(res => setUsers(res.data));
  }, []);

  const toggleBanUser = async (id, isBanned) => {
    await axios.patch(`http://localhost:9999/users/${id}`, { banned: !isBanned },);
    setUsers(users.map(u => u.id === id ? { ...u, banned: !isBanned } : u));
  };

  return (
    <div>
      <h4 className="mb-3">Quản lý tài khoản người dùng</h4>
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                {u.banned ? <Badge bg="danger">Bị khóa</Badge> : <Badge bg="success">Hoạt động</Badge>}
              </td>
              <td>
                <Button
                  variant={u.banned ? "success" : "danger"}
                  size="sm"
                  onClick={() => toggleBanUser(u.id, u.banned)}
                >
                  {u.banned ? "Mở khóa" : "Khóa"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
