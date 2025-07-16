import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function BlogCard({ blog }) {
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate(`/blog-detail?id=${blog.id}&title=${encodeURIComponent(blog.title)}`);
  };

  return (
    <Card className="h-100 shadow-sm border-0 rounded-4 hover-effect">
      <Card.Img variant="top" src={blog.photo_url} style={{ height: "220px", objectFit: "cover" }} />
      <Card.Body>
        <Card.Title style={{ fontSize: "1.1rem", fontWeight: "600", minHeight: "50px" }}>{blog.title}</Card.Title>
        <Card.Text style={{ minHeight: "70px" }}>
          {blog.snippet && blog.snippet.length > 100
            ? blog.snippet.slice(0, 100) + "..."
            : blog.snippet || "No summary available."}
        </Card.Text>

        <Button variant="primary" onClick={handleReadMore}>Xem thêm</Button>
      </Card.Body>
    </Card>
  );
}

export default BlogCard;
