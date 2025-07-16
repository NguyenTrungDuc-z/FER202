import { useState } from "react";
import { Container, Form, Button, Alert, Row, Col, Card } from "react-bootstrap";
import axios from "axios";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:9999/contacts", {
        ...form,
        status: 0, // mặc định là chưa xử lý
        createdAt: new Date().toISOString()
      });
      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError("Gửi liên hệ thất bại.");
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="p-4 shadow">
            <h2 className="text-center mb-4">Liên hệ với chúng tôi</h2>
            {success && <Alert variant="success">Đã gửi liên hệ thành công!</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Họ tên</Form.Label>
                <Form.Control
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nội dung</Form.Label>
                <Form.Control
                  as="textarea"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100">
                Gửi liên hệ
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
