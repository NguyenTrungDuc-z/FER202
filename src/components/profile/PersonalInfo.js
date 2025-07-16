import { Card, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import axios from "axios";

export default function PersonalInfo() {
  const { currentUser, login } = useAuth();
  const [formData, setFormData] = useState({ ...currentUser });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:9999/users/${currentUser.id}`, formData);
      login(formData); // Cập nhật AuthContext
      setMessage("Cập nhật thông tin thành công!");
    } catch (err) {
      setMessage("Lỗi khi cập nhật thông tin.");
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <h5>Thông tin cá nhân</h5>
      </Card.Header>
      <Card.Body>
        {message && <Alert variant="info">{message}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={4} className="text-center">
              <img
                src={formData.avatar || "/images/macdinh.png"}
                alt="Avatar"
                className="img-fluid rounded-circle mb-3"
                width="150"
                height="150"
              />
              <Form.Group>
                <Form.Label className="d-block">Chọn ảnh đại diện</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </Form.Group>
            </Col>

            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Tên đăng nhập</Form.Label>
                <Form.Control
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Giới tính</Form.Label>
                <Form.Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                </Form.Select>
              </Form.Group>

              <Button type="submit" variant="primary">Lưu thay đổi</Button>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
}
