import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
  InputGroup
} from "react-bootstrap";
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
        (u) =>
          (u.email === emailOrUsername || u.username === emailOrUsername) &&
          u.password === password
      );

      if (foundUser) {
        if (foundUser.banned) {
          setError(
            "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên."
          );
          return;
        }
        login(foundUser);
        navigate(foundUser.role === "admin" ? "/profile" : "/");
      } else {
        setError("Email/tên người dùng hoặc mật khẩu không đúng!");
      }
    } catch (err) {
      setError("Lỗi đăng nhập.");
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={6} lg={5}>
          <Card className="shadow-sm">
            <Card.Body>
              <h3 className="text-center mb-4">Đăng nhập</h3>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Label>Email hoặc tên người dùng</Form.Label>
                  <Form.Control
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    placeholder="Nhập email hoặc username"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu"
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Đăng nhập
                </Button>
              </Form>

              <div className="mt-3 text-center">
                <Link to="/forgot" className="me-2">Quên mật khẩu?</Link>
                <span>|</span>
                <Link to="/register" className="ms-2">Đăng ký</Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
