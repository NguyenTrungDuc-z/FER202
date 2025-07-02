import React from "react";
import { Navbar, Nav, Container, NavDropdown, Image, Form } from "react-bootstrap";

function AppNavbar({ onSearch }) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand href="/">HDG-News</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/write">Write Blog</Nav.Link>
            <Nav.Link href="/about">About Us</Nav.Link>
          </Nav>

          {/* Live search input */}
          <Form className="d-flex me-3">
            <Form.Control
              type="search"
              placeholder="Search news..."
              className="me-2"
              onChange={(e) => onSearch(e.target.value)}
            />
          </Form>

          <Nav>
            <NavDropdown
              align="end"
              title={
                <Image
                  src="https://cdn.kienthuc.net.vn/images/920a96197c3e1f353fef6db7f435d11e1cfef57b5317677c33e223d09592f93cffe4cc997d19e3f0e6b9d93b56842403/thinh-5.png"
                  alt="avatar"
                  roundedCircle
                  width="36"
                  height="36"
                  style={{ objectFit: "cover" }}
                />
              }
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item href="#profile">Profile</NavDropdown.Item>
              <NavDropdown.Item href="#logout">Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
