import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Logo from "../img/logo.png";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState([]);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() && searchType.length) {
      navigate(`/?term=${searchTerm.trim()}&type=${searchType.join(",")}`);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchType([]);
    navigate('/'); // Navigate to the home page without any search parameters
  };

  return (
    <div className="navbar">
      <div className="container">
        <div className="top-row">
          <div className="logo">
            <Link to="/">
              <img src={Logo} alt="Logo" />
            </Link>
          </div>
          <div className="search-container">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select onChange={(e) => setSearchType([e.target.value])}>
                <option value="">Select Filter</option>
                <option value="all">All</option>
                <option value="title">Title</option>
                <option value="content">Content</option>
                <option value="author">Author</option>
              </select>
              <button type="submit">Search</button>
              <button type="button" className="clear-search" onClick={clearSearch}>Clear Search</button>
            </form>
          </div>
          <div className="user-info">
            {currentUser ? (
              <div className="action-button logout" onClick={logout}>Logout</div>
            ) : (
              <Link to="/login" className="action-button login">Login</Link>
            )}
            <Link to="/write" className="action-button write">Write</Link>
          </div>
        </div>
        <div className="links">
          <Link className="link" to="/?cat=art">
            <h6>ART</h6>
          </Link>
          <Link className="link" to="/?cat=science">
            <h6>SCIENCE</h6>
          </Link>
          <Link className="link" to="/?cat=technology">
            <h6>TECHNOLOGY</h6>
          </Link>
          <Link className="link" to="/?cat=cinema">
            <h6>CINEMA</h6>
          </Link>
          <Link className="link" to="/?cat=design">
            <h6>DESIGN</h6>
          </Link>
          <Link className="link" to="/?cat=food">
            <h6>FOOD</h6>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
