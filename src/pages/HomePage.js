import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Carousel from "react-bootstrap/Carousel";

const HomePage = () => {
  const navigate = useNavigate();
  const [, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Load user và bài viết kèm thông tin phụ
  useEffect(() => {
    const localUser = localStorage.getItem("user-info");
    const sessionUser = sessionStorage.getItem("user-info");

    try {
      const parsedUser = JSON.parse(localUser || sessionUser);
      setUser(parsedUser);
    } catch (error) {
      setUser(null);
    }

    const fetchData = async () => {
      try {
        const [postsRes, commentsRes, likesRes, categoriesRes] =
          await Promise.all([
            axios.get("http://localhost:9999/posts"),
            axios.get("http://localhost:9999/comments"),
            axios.get("http://localhost:9999/likes"),
            axios.get("http://localhost:9999/categories"),
          ]);

        const enrichedPosts = postsRes.data.map((post) => {
          const postComments = commentsRes.data.filter(
            (cmt) => +cmt.postId === +post.id
          );
          const postLikes = likesRes.data.filter(
            (like) => +like.postId === +post.id
          );
          const category = categoriesRes.data.find(
            (cat) => +cat.id === +post.categoryId
          );

          return {
            ...post,
            comments: postComments,
            likes: postLikes,
            category: category?.name || "Không rõ",
          };
        });

        setPosts(enrichedPosts);
        setFilteredPosts(enrichedPosts);
      } catch (err) {
        console.error("Lỗi khi load dữ liệu:", err);
      }
    };

    fetchData();
  }, []);

  //cho về trang home
  useEffect(() => {
    const handleResetHome = () => {
      setSearch(""); // reset ô tìm kiếm
      setCategoryFilter("Tất cả"); // reset lọc chuyên mục
      setCurrentPage(1); // về trang đầu
    };

    window.addEventListener("reset-home", handleResetHome);
    return () => window.removeEventListener("reset-home", handleResetHome);
  }, []);

  // Lọc bài viết khi search hoặc chọn category
  useEffect(() => {
    let temp = [...posts];

    if (search.trim() !== "") {
      temp = temp.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter !== "Tất cả") {
      temp = temp.filter((p) => p.category === categoryFilter);
    }

    setFilteredPosts(temp);
  }, [search, categoryFilter, posts]);

  // Tính top tác giả
  const topAuthors = [...posts]
    .reduce((acc, post) => {
      const existing = acc.find((a) => a.author === post.author);
      if (existing) {
        existing.likes += post.likes?.length || 0;
        existing.comments += post.comments?.length || 0;
        existing.posts += 1;
      } else {
        acc.push({
          author: post.author,
          likes: post.likes?.length || 0,
          comments: post.comments?.length || 0,
          posts: 1,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => b.likes + b.comments - (a.likes + a.comments))
    .slice(0, 5);

  // Tính top bạn đọc
  const topReaders = [...posts]
    .flatMap((post) => {
      const commentUsers = (post.comments || []).map((cmt) => cmt.username);
      const likeUsers = (post.likes || []).map((like) => like.username);
      return [...commentUsers, ...likeUsers];
    })
    .reduce((acc, name) => {
      const existing = acc.find((u) => u.name === name);
      if (existing) {
        existing.count += 1;
      } else {
        acc.push({ name, count: 1 });
      }
      return acc;
    }, [])
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Phân trang
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  //
  useEffect(() => {
    const handleSortNewest = () => {
      const sorted = [...filteredPosts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setFilteredPosts(sorted);
    };

    window.addEventListener("sort-newest", handleSortNewest);
    return () => window.removeEventListener("sort-newest", handleSortNewest);
  }, [filteredPosts]);

  useEffect(() => {
    const handleFilterCategory = (e) => {
      const selectedCategoryId = e.detail;
      const selected = posts.find((p) => +p.categoryId === +selectedCategoryId);
      if (selected) {
        setCategoryFilter(selected.category); // Dùng tên category để lọc
      }
    };

    window.addEventListener("filter-category", handleFilterCategory);
    return () =>
      window.removeEventListener("filter-category", handleFilterCategory);
  }, [posts]);

  return (
    <div className="container mt-4">
      {/* Carousel */}
      <Carousel className="mb-4">
        {posts.slice(0, 3).map((post, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={post.image}
              alt={post.title}
              style={{ height: "400px", objectFit: "cover" }}
            />
            <Carousel.Caption className="bg-dark bg-opacity-50 p-3 rounded">
              <h3>{post.title}</h3>
              <p className="d-none d-md-block">
                {post.content?.slice(0, 100)}...
              </p>
              <button
                className="btn btn-outline-light btn-sm mt-2"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                Đọc bài viết
              </button>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Bộ lọc */}
      <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 mb-4">
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: "300px" }}
          placeholder="🔍 Tìm kiếm bài viết..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="row">
        <div className="col-lg-8">
          <h2 className="text-right mb-4">Chia sẻ về lập trình & công nghệ</h2>
          <div className="row row-cols-1 row-cols-md-2 g-4">
            {currentPosts.map((post) => (
              <div key={post.id} className="col">
                <div className="card h-100 shadow-sm hover-shadow">
                  <img
                    src={post.image}
                    className="card-img-top"
                    alt={post.title}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text text-truncate">{post.content}</p>
                    <div className="mb-2">
                      {post.tag?.split(",").map((tag, i) => (
                        <span
                          key={i}
                          className="badge bg-secondary me-1"
                          style={{ fontSize: "0.75rem" }}
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>

                    <p className="text-muted mb-1">
                      <strong>Tác giả:</strong> {post.author}
                    </p>
                    <p className="text-muted mb-1">
                      <strong>Chuyên mục:</strong> {post.category}
                    </p>
                    <p className="text-muted mb-2">
                      <em>{new Date(post.createdAt).toLocaleDateString()}</em>
                    </p>
                    <div className="mt-auto">
                      <button
                        className="btn btn-primary w-100"
                        onClick={() => navigate(`/post/${post.id}`)}
                      >
                        Đọc tiếp
                      </button>
                    </div>
                  </div>
                  <div className="card-footer bg-white d-flex justify-content-between small text-muted">
                    <span>❤️ {post.likes?.length || 0}</span>
                    <span>💬 {post.comments?.length || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4" style={{ marginTop: "63px" }}>
          {/* Card 1: Tác giả nổi bật */}
          <div className="card shadow-sm mb-4 w-100">
            <div className="card-header bg-primary text-white">
              <strong>📌 Tác giả nổi bật</strong>
            </div>
            <ul className="list-group list-group-flush">
              {topAuthors.map((author, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-start"
                >
                  <div>
                    <strong>{author.author}</strong>
                    <div className="small text-muted">
                      {author.posts} bài • ❤️ {author.likes} • 💬{" "}
                      {author.comments}
                    </div>
                  </div>
                  <span className="badge bg-success rounded-pill">
                    TOP {index + 1}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 2: Bạn đọc sôi nổi */}
          <div className="card shadow-sm w-100" style={{ marginTop: "150px" }}>
            <div className="card-header bg-success text-white">
              <strong>🔥 Bạn đọc sôi nổi</strong>
            </div>
            <ul className="list-group list-group-flush">
              {topReaders.map((reader, index) => (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-start"
                >
                  <div>
                    <strong>{reader.name}</strong>
                    <div className="small text-muted">
                      {reader.count} lượt tương tác
                    </div>
                  </div>
                  <span className="badge bg-danger rounded-pill">
                    TOP {index + 1}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="d-flex justify-content-center align-items-center gap-3 mt-4 flex-wrap">
        <button
          className="btn btn-outline-primary btn-sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          ← Trước
        </button>

        <div className="d-flex align-items-center gap-2">
          <span>Trang</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              let page = parseInt(e.target.value);
              if (!isNaN(page)) {
                if (page < 1) page = 1;
                else if (page > totalPages) page = totalPages;
                setCurrentPage(page);
              }
            }}
            className="form-control"
            style={{ width: "50px" }}
          />
          <span>/ {totalPages}</span>
        </div>

        <button
          className="btn btn-outline-primary btn-sm"
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          Sau →
        </button>
      </div>
    </div>
  );
};

export default HomePage;