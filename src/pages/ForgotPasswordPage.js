import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
  InputGroup,
} from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.get(`http://localhost:9999/users?email=${email}`);

      if (res.data.length === 0) {
        setError("Không tìm thấy người dùng với email này!");
        return;
      }

      const user = res.data[0];
      await axios.patch(`http://localhost:9999/users/${user.id}`, {
        password: newPassword,
      });

      setSuccess("✅ Mật khẩu đã được cập nhật thành công!");
      setEmail("");
      setNewPassword("");
    } catch (err) {
      setError("Có lỗi xảy ra khi cập nhật mật khẩu.");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4 shadow-lg">
            <h2 className="text-center mb-4 text-warning">Cấp lại mật khẩu</h2>
            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleReset}>
              <Form.Group className="mb-3">
                <Form.Label>Email đã đăng ký</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mật khẩu mới</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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

              <Button variant="warning" type="submit" className="w-100">
                Cập nhật mật khẩu
              </Button>
            </Form>

            <div className="text-center mt-3">
              <Link to="/login">← Quay lại đăng nhập</Link>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
