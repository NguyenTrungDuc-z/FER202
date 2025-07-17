import { useEffect, useState } from "react";
import axios from "axios";
import {
    Table,
    Button,
    Badge,
    Modal,
    Form,
    Spinner,
    Image,
} from "react-bootstrap";

export default function PostManager() {
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [isNewPost, setIsNewPost] = useState(false);

    useEffect(() => {
        axios.get("http://localhost:9999/posts").then((res) => setPosts(res.data));
        axios.get("http://localhost:9999/categories").then((res) =>
            setCategories(res.data)
        );
    }, []);

    const handleTogglePublic = async (postId, currentStatus) => {
        await axios.patch(`http://localhost:9999/posts/${postId}`, {
            public: !currentStatus,
        });
        setPosts((prev) =>
            prev.map((p) =>
                p.id === postId ? { ...p, public: !currentStatus } : p
            )
        );
    };

    const handleRowClick = (post) => {
        setIsNewPost(false);
        // Xử lý tag: nếu là mảng thì chuyển về chuỗi
        const tagString = Array.isArray(post.tag) ? post.tag.join(", ") : post.tag || "";
        setSelectedPost({ ...post, tag: tagString });
        setPreviewImage(post.image || "");
        setShowModal(true);
    };

    const handleModalChange = (e) => {
        const { name, value } = e.target;
        setSelectedPost((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewImage(reader.result); // base64
            setSelectedPost((prev) => ({ ...prev, image: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        try {
            const tagValue = selectedPost.tag?.split(",").map((t) => t.trim()); // convert tag chuỗi -> mảng
            const payload = {
                ...selectedPost,
                tag: tagValue,
                updatedAt: new Date().toISOString(),
            };

            if (isNewPost) {
                const res = await axios.post(`http://localhost:9999/posts`, {
                    ...payload,
                    createdAt: new Date().toISOString(),
                    public: true,
                    status: "active",
                    views: 0,
                });
                setPosts((prev) => [...prev, res.data]);
            } else {
                await axios.put(
                    `http://localhost:9999/posts/${selectedPost.id}`,
                    payload
                );
                setPosts((prev) =>
                    prev.map((p) => (p.id === selectedPost.id ? { ...payload } : p))
                );
            }

            setShowModal(false);
        } catch (err) {
            alert("Lỗi khi lưu bài viết.");
        }
    };

    const handleAddPost = () => {
        setIsNewPost(true);
        setSelectedPost({
            title: "",
            content: "",
            image: "",
            tag: "",
            author: "admin",
            categoryId: "",
        });
        setPreviewImage("");
        setShowModal(true);
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Quản lý bài viết</h4>
                <Button variant="primary" onClick={handleAddPost}>
                    + Thêm bài viết
                </Button>
            </div>

            <Table bordered hover responsive>
                <thead>
                    <tr>
                        <th>Tiêu đề</th>
                        <th>Ngày tạo</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((post) => (
                        <tr
                            key={post.id}
                            onClick={() => handleRowClick(post)}
                            style={{ cursor: "pointer" }}
                        >
                            <td>{post.title}</td>
                            <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                            <td>
                                {post.public ? (
                                    <Badge bg="success">Hiển thị</Badge>
                                ) : (
                                    <Badge bg="secondary">Đã ẩn</Badge>
                                )}
                            </td>
                            <td>
                                <Button
                                    variant={post.public ? "warning" : "success"}
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleTogglePublic(post.id, post.public);
                                    }}
                                >
                                    {post.public ? "Ẩn" : "Hiển thị"}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal thêm / sửa bài viết */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {isNewPost ? "Thêm bài viết" : "Cập nhật bài viết"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedPost ? (
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Tiêu đề</Form.Label>
                                <Form.Control
                                    name="title"
                                    value={selectedPost.title}
                                    onChange={handleModalChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Nội dung</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    name="content"
                                    value={selectedPost.content}
                                    onChange={handleModalChange}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Chuyên mục</Form.Label>
                                <Form.Select
                                    name="categoryId"
                                    value={selectedPost.categoryId}
                                    onChange={handleModalChange}
                                >
                                    <option value="">-- Chọn chuyên mục --</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Ảnh</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                {previewImage && (
                                    <Image
                                        src={previewImage}
                                        alt="preview"
                                        fluid
                                        className="mt-2 border rounded"
                                        style={{ maxHeight: "200px", objectFit: "contain" }}
                                    />
                                )}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Thẻ (tags)</Form.Label>
                                <Form.Control
                                    name="tag"
                                    value={selectedPost.tag}
                                    onChange={handleModalChange}
                                    placeholder="Cách nhau bởi dấu phẩy, ví dụ: react, js, web"
                                />
                            </Form.Group>
                        </Form>
                    ) : (
                        <Spinner animation="border" />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
