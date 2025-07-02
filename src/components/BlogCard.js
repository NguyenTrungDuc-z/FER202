import React, { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";

function BlogCard({ blog }) {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <>
      <Card 
        onClick={handleShow} 
        style={{ 
          height: "370px", 
          cursor: "pointer",
          boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
          borderRadius: "10px",
          overflow: "hidden"
        }}
        className="h-100"
      >
        <div style={{ height: "180px", overflow: "hidden" }}>
          <Card.Img 
            variant="top" 
            src={blog.photo_url} 
            alt={blog.title}
            style={{ 
              height: "100%", 
              width: "100%", 
              objectFit: "cover" 
            }}
          />
        </div>
        <Card.Body className="d-flex flex-column">
          <Card.Title 
            className="mb-2" 
            style={{ fontSize: "1rem", lineHeight: "1.3rem", height: "2.6rem", overflow: "hidden" }}
          >
            {blog.title}
          </Card.Title>
          <Card.Text 
            style={{ fontSize: "0.85rem", height: "3rem", overflow: "hidden" }}
          >
            {blog.snippet}
          </Card.Text>
          <div className="mt-auto">
            <Button 
              variant="primary" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                window.open(blog.link, "_blank");
              }}
            >
              Read More
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Modal chi tiết */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{blog.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={blog.photo_url} alt={blog.title} className="img-fluid mb-3" />
          <p>{blog.snippet}</p>
          <p><strong>Source:</strong> {blog.source_name}</p>
          <p><strong>Published:</strong> {new Date(blog.published_datetime_utc).toLocaleString()}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => window.open(blog.link, "_blank")}>
            Đọc bài gốc
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default BlogCard;
