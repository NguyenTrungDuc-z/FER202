import { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AddPostPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    categoryId: "",
  });

  useEffect(() => {
    axios.get("http://localhost:9999/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:9999/posts", {
        ...formData,
        userId: user.id,
        author: user.username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "published",
        views: 0,
        tags: []
      });
      navigate("/profile");
    } catch (err) {
      console.error("Lỗi khi thêm bài viết:", err);
    }
  };

  return (
    <Container className="my-4">
      <h3>Thêm bài viết mới</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Tiêu đề</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Hình ảnh (URL)</Form.Label>
          <Form.Control
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Danh mục</Form.Label>
          <Form.Select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nội dung</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button type="submit" variant="success">Đăng bài</Button>
      </Form>
    </Container>
  );
}
