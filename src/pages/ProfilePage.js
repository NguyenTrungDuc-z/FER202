// src/pages/ProfilePage.js
import { useState } from "react";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import PersonalInfo from "../components/profile/PersonalInfo";
import PostManager from "../components/profile/PostManager";
import UserManager from "../components/profile/UserManager";
import ContactManager from "../components/profile/ContactManager";
import { useAuth } from "../contexts/AuthContext";

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");

  const isAdmin = currentUser?.role === "admin";

  const renderContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInfo />;
      case "posts":
        return isAdmin ? <PostManager /> : null;
      case "users":
        return isAdmin ? <UserManager /> : null;
      case "contacts":
        return isAdmin ? <ContactManager /> : null;
      default:
        return <PersonalInfo />;
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={3}>
          <ListGroup>
            <ListGroup.Item
              action
              active={activeTab === "personal"}
              onClick={() => setActiveTab("personal")}
            >
              Thông tin cá nhân
            </ListGroup.Item>

            {isAdmin && (
              <>
                <ListGroup.Item
                  action
                  active={activeTab === "posts"}
                  onClick={() => setActiveTab("posts")}
                >
                  Quản lý bài viết
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  active={activeTab === "users"}
                  onClick={() => setActiveTab("users")}
                >
                  Quản lý tài khoản
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  active={activeTab === "contacts"}
                  onClick={() => setActiveTab("contacts")}
                >
                  Quản lý liên hệ
                </ListGroup.Item>
              </>
            )}
          </ListGroup>
        </Col>

        <Col md={9}>
          {renderContent()}
        </Col>
      </Row>
    </Container>
  );
}
