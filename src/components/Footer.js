import React from "react";
import { Container } from "react-bootstrap";

function AppFooter() {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-auto" fixed="bottom">
      <Container>
        <p className="mb-0">
          &copy; {new Date().getFullYear()} My News Site. All rights reserved.
        </p>
        <p className="mb-0">
          <a href="/privacy-policy" className="text-white">Privacy Policy</a> | 
          <a href="/terms-of-service" className="text-white"> Terms of Service</a>
        </p>
      </Container>
    </footer>
  );
}

export default AppFooter;
