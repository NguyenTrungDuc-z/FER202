import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaCommentDots } from 'react-icons/fa';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user-info') || sessionStorage.getItem('user-info'));
    setUser(storedUser);

    if (!storedUser) {
      alert('Bạn cần đăng nhập để xem bài viết.');
      localStorage.setItem('redirectPostId', id);
      navigate('/login');
      return;
    }

    axios.get(`http://localhost:9999/posts/${id}?_embed=comments&_embed=likes`)
      .then(res => {
        setPost(res.data);
        setLikes(res.data.likes || []);
        setComments(res.data.comments || []);
        setHasLiked(res.data.likes?.some(like => like.userId === storedUser?.id));
      })
      .catch(err => console.error(err));
  }, [id, navigate]);

  const handleToggleLike = async () => {
    if (!user) return;
    const existingLike = likes.find((like) => like.userId === user.id);
    if (existingLike) {
      await axios.delete(`http://localhost:9999/likes/${existingLike.id}`);
      setLikes(likes.filter((l) => l.id !== existingLike.id));
      setHasLiked(false);
    } else {
      const res = await axios.post('http://localhost:9999/likes', {
        postId: parseInt(id),
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
    const res = await axios.post('http://localhost:9999/comments', {
      postId: parseInt(id),
      userId: user.id,
      username: user.username,
      content: newComment,
      createdAt: new Date().toISOString(),
    });
    setComments([...comments, res.data]);
    setNewComment('');
  };

  if (!post) return <p>Đang tải bài viết...</p>;

  return (
    <div className="container my-4">
      <h2>{post.title}</h2>
      <img src={post.image} alt={post.title} className="img-fluid mb-3" />
      <p>{post.content}</p>
      <p><strong>Tác giả:</strong> {post.author}</p>
      <p><strong>Ngày đăng:</strong> {new Date(post.createdAt).toLocaleDateString()}</p>

      <hr />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className="btn btn-outline-danger" onClick={handleToggleLike}>
          {hasLiked ? <FaHeart color="red" /> : <FaRegHeart />} {likes.length}
        </button>
        <span><FaCommentDots /> {comments.length}</span>
      </div>

      {/* Gửi bình luận */}
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

      {/* Danh sách bình luận */}
      <div>
        <h5>Bình luận</h5>
        {comments.length === 0 ? (
          <p className="text-muted">Chưa có bình luận nào.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="border-bottom py-2">
              <strong>{comment.username}</strong> —{' '}
              <small className="text-muted">
                {new Date(comment.createdAt).toLocaleString()}
              </small>
              <p>{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostDetail;
