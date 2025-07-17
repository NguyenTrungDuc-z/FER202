import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart, FaRegHeart, FaCommentDots } from "react-icons/fa";

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [likes, setLikes] = useState([]);
    const [comments, setComments] = useState([]);
    const [hasLiked, setHasLiked] = useState(false);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        const storedUser = JSON.parse(
            localStorage.getItem("user-info") || sessionStorage.getItem("user-info")
        );
        setUser(storedUser);

        if (!storedUser) {
            alert("Bạn cần đăng nhập để xem bài viết.");
            localStorage.setItem("redirectPostId", id);
            navigate("/login");
            return;
        }

        axios
            .get(`http://localhost:9999/posts/${id}?_embed=comments&_embed=likes`)
            .then(async (res) => {
                setPost(res.data);
                setLikes(res.data.likes || []);
                setComments(res.data.comments || []);
                setHasLiked(
                    res.data.likes?.some(
                        (like) => like.postId === id && like.userId === storedUser?.id
                    )
                );

                // Lấy bài viết liên quan
                if (res.data.categoryId) {
                    const relatedRes = await axios.get(
                        `http://localhost:9999/posts?categoryId=${res.data.categoryId}&id_ne=${id}&_limit=3`
                    );
                    setRelatedPosts(relatedRes.data);
                }
            })
            .catch((err) => console.error(err));
    }, [id, navigate]);

    const handleToggleLike = async () => {
        if (!user) return;

        const existingLike = likes.find(
            (like) => like.userId === user.id && like.postId === id
        );

        if (existingLike) {
            await axios.delete(`http://localhost:9999/likes/${existingLike.id}`);
            setLikes(likes.filter((l) => l.id !== existingLike.id));
            setHasLiked(false);
        } else {
            const res = await axios.post("http://localhost:9999/likes", {
                postId: id,
                userId: user.id,
                username: user.username,
                createdAt: new Date().toISOString(),
            });
            setLikes([...likes, res.data]);
            setHasLiked(true);
        }
    };

    const handleCommentSubmit = async () => {
        if (!user || !newComment.trim()) return;

        const res = await axios.post("http://localhost:9999/comments", {
            postId: id,
            userId: user.id,
            username: user.username,
            content: newComment,
            createdAt: new Date().toISOString(),
        });

        setComments([...comments, res.data]);
        setNewComment("");
    };

    if (!post) return <p>Đang tải bài viết...</p>;

    return (
        <div className="container my-4">
            <h2>{post.title}</h2>
            <img
                src={post.image}
                alt={post.title}
                className="img-fluid mb-3 rounded"
                style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                }}
            />

            <p>{post.content}</p>

            {/* Tags */}
            {post.tag && (
                <div className="mb-3">
                    {post.tag
                        .split(",")
                        .map((tag, index) => (
                            <span
                                key={index}
                                className="badge bg-secondary me-2 mb-1"
                                style={{ fontSize: "0.9em" }}
                            >
                                #{tag.trim()}
                            </span>
                        ))}
                </div>
            )}

            <p>
                <strong>Tác giả:</strong> {post.author}
            </p>
            <p>
                <strong>Chuyên mục:</strong> {post.categoryName}
            </p>
            <p>
                <strong>Ngày đăng:</strong>{" "}
                {new Date(post.createdAt).toLocaleDateString()}
            </p>

            <hr />
            <div className="d-flex justify-content-between align-items-center mb-3">
                <button className="btn btn-outline-danger" onClick={handleToggleLike}>
                    {hasLiked ? <FaHeart color="red" /> : <FaRegHeart />} {likes.length || 0}
                </button>
                <span>
                    <FaCommentDots /> {comments.length || 0}
                </span>
            </div>

            {user && (
                <div className="mb-4">
                    <textarea
                        className="form-control mb-2"
                        placeholder="Nhập bình luận của bạn..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={handleCommentSubmit}>
                        Gửi bình luận
                    </button>
                </div>
            )}

            <div>
                <h5>Bình luận</h5>
                {comments.length === 0 ? (
                    <p className="text-muted">Chưa có bình luận nào.</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="border-bottom py-2">
                            <strong>{comment.username}</strong>{" "}
                            <small className="text-muted">
                                ({new Date(comment.createdAt).toLocaleString()})
                            </small>
                            <p>{comment.content}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Bài viết liên quan */}
            {relatedPosts.length > 0 && (
                <>
                    <hr />
                    <h5>Bài viết liên quan</h5>
                    <div className="row row-cols-1 row-cols-md-3 g-3">
                        {relatedPosts.map((rp) => (
                            <div key={rp.id} className="col">
                                <div className="card h-100 shadow-sm">
                                    <img
                                        src={rp.image}
                                        className="card-img-top"
                                        alt={rp.title}
                                        style={{ height: "150px", objectFit: "cover" }}
                                    />
                                    <div className="card-body d-flex flex-column">
                                        <h6 className="card-title">{rp.title}</h6>
                                        <p className="card-text text-truncate">{rp.content}</p>
                                        <button
                                            className="btn btn-sm btn-primary mt-auto"
                                            onClick={() => navigate(`/post/${rp.id}`)}
                                        >
                                            Xem chi tiết
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default PostDetail;
