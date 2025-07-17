import { Card, Row, Col, Form, Button, Alert, InputGroup } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PersonalInfo() {
  const { currentUser, login } = useAuth();
  const [formData, setFormData] = useState({ ...currentUser });
  const [infoMessage, setInfoMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

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

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:9999/users/${currentUser.id}`, formData);
      login(formData);
      setInfoMessage("Cập nhật thông tin thành công!");
    } catch (err) {
      setInfoMessage("Lỗi khi cập nhật thông tin.");
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const validatePasswords = () => {
    if (!passwords.oldPassword || !passwords.newPassword || !passwords.confirmPassword) {
      return "Vui lòng điền đầy đủ các trường.";
    }
    if (passwords.oldPassword !== currentUser.password) {
      return "Mật khẩu hiện tại không đúng.";
    }
    if (passwords.newPassword.length < 6) {
      return "Mật khẩu mới phải có ít nhất 6 ký tự.";
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      return "Xác nhận mật khẩu không khớp.";
    }
    return "";
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    const error = validatePasswords();
    if (error) {
      setPasswordError(error);
      return;
    }

    try {
      const updatedUser = { ...currentUser, password: passwords.newPassword };
      await axios.patch(`http://localhost:9999/users/${currentUser.id}`, updatedUser);
      login(updatedUser);
      setPasswordMessage("Đổi mật khẩu thành công!");
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordError("Đổi mật khẩu thất bại.");
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Header>
        <h5>Thông tin cá nhân</h5>
      </Card.Header>
      <Card.Body>
        {infoMessage && <Alert variant="info">{infoMessage}</Alert>}
        <Form onSubmit={handleInfoSubmit}>
          <Row>
            <Col md={4} className="text-center">
              <img
                src={formData.avatar || "/images/macdinh.png"}
                alt="Avatar"
                className="img-fluid rounded-circle mb-3"
                width="150"
                height="150"
                style={{ objectFit: "cover" }}
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

              <Button type="submit" variant="primary">Lưu thông tin</Button>
            </Col>
          </Row>
        </Form>

        <hr className="my-4" />

        <h5>Đổi mật khẩu</h5>
        {passwordMessage && <Alert variant="success">{passwordMessage}</Alert>}
        {passwordError && <Alert variant="danger">{passwordError}</Alert>}
        <Form onSubmit={handlePasswordSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu hiện tại</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword.old ? "text" : "password"}
                name="oldPassword"
                value={passwords.oldPassword}
                onChange={handlePasswordChange}
              />
              <Button
                variant="outline-secondary"
                onClick={() => togglePassword("old")}
              >
                {showPassword.old ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu mới</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
              />
              <Button
                variant="outline-secondary"
                onClick={() => togglePassword("new")}
              >
                {showPassword.new ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Xác nhận mật khẩu mới</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
              />
              <Button
                variant="outline-secondary"
                onClick={() => togglePassword("confirm")}
              >
                {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <Button type="submit" variant="warning">Đổi mật khẩu</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
