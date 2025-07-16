import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Container, Row, Col, Form, Button, Card, Alert, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "", email: "", password: "", gender: "male"
  });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const check = await axios.get(`http://localhost:9999/users?email=${form.email}`);
      if (check.data.length > 0) return setError("Email đã được đăng ký!");

      const newUser = {
        ...form,
        avatar: "/macdinh.png",
        role: "user",
        status: 1,
        createdAt: new Date().toISOString(),
        savedPosts: []
      };

      const res = await axios.post(`http://localhost:9999/users`, newUser);
      login(res.data);
      navigate("/");
    } catch (err) {
      setError("Lỗi đăng ký.");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4 shadow">
            <h2 className="text-center mb-4">Đăng ký</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleRegister}>
              <Form.Group className="mb-3">
                <Form.Label>Tên người dùng</Form.Label>
                <Form.Control name="username" value={form.username} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={form.email} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Giới tính</Form.Label>
                <Form.Select name="gender" value={form.gender} onChange={handleChange}>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mật khẩu</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup>
              </Form.Group>
              <Button type="submit" variant="success" className="w-100">Đăng ký</Button>
            </Form>
            <div className="text-center mt-3">
              <Link to="/login">Đã có tài khoản? Đăng nhập</Link>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
