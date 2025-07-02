import React from "react";

function DropDownMenu() {
  return (
    <div
      className="dropdown-menu dropdown-menu-end show"
      style={{ position: "absolute", top: "50px", right: "0" }}
    >
      <a className="dropdown-item" href="/profile">My Profile</a>
      <a className="dropdown-item" href="/settings">Settings</a>
      <div className="dropdown-divider"></div>
      <a className="dropdown-item" href="/logout">Logout</a>
    </div>
  );
}

export default DropDownMenu;
