import "../App.css";
import React from "react";
import { Link } from "react-router-dom";
import "./styles/Navbar.css";

export function NavBar({ user }) {
  return (
    <div className="navbar-dark Nav">
      <h1 style={{ textAlign: "left", color: "white" }}>Hello {user}</h1>
      <Link
        to="/logout/"
        style={{ color: "white", textDecoration: "None", marginLeft: "60%" }}
      >
        Logout
      </Link>
    </div>
  );
}

export default NavBar;
