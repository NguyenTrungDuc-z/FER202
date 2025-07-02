import React, { useState } from "react";
import AppNavbar from "./components/Navbar";
import AppFooter from "./components/Footer";
import Home from "./Home";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = (keyword) => {
    setSearchKeyword(keyword);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <AppNavbar onSearch={handleSearch} />
      <div className="flex-grow-1 mt-5 pt-3">
        <Home keyword={searchKeyword} />
      </div>
      <AppFooter />
    </div>
  );
}

export default App;
