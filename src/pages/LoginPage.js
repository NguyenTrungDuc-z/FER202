import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Container, Row, Col, Form, Button, Card, Alert, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:9999/users`);
      const foundUser = res.data.find(
        u =>
          (u.email === emailOrUsername || u.username === emailOrUsername) &&
          u.password === password
      );

      if (foundUser) {
        if (foundUser.banned) {
          setError("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.");
          return;
        }
        console.log("User found:", foundUser); // kiểm tra
        login(foundUser);
        if (foundUser.role === "admin") {
          navigate("/profile");
        } else {
          navigate("/");
        }

      } else {
        setError("Email/tên người dùng hoặc mật khẩu không đúng!");
      }
    } catch (err) {
      setError("Lỗi đăng nhập.");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4 shadow">
            <h2 className="text-center mb-4">Đăng nhập</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Email hoặc tên người dùng</Form.Label>
                <Form.Control
                  value={emailOrUsername}
                  onChange={e => setEmailOrUsername(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mật khẩu</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
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
              <Button variant="primary" type="submit" className="w-100">Đăng nhập</Button>
            </Form>
            <div className="text-center mt-3">
              <Link to="/forgot">Quên mật khẩu?</Link> | <Link to="/register">Đăng ký</Link>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
