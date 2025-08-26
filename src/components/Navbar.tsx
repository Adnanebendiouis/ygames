import { useState, useEffect, useRef } from 'react';
import '../styles/Navbar.css';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import logo from '../images/ygames-logo.png';

import { useContext } from 'react';
import { AuthContext } from "../context/auth-context";
import LoginIcon from '@mui/icons-material/Login';
import UserDropdown from './UserDropdown';

import { Link, useNavigate } from 'react-router-dom';
import CategoryDropdown from './DropdownCategroy';
const Navbar = () => {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null); // NEW ref
  const { isAuthenticated, isAdmin } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (showSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showSearch]);

  // ✅ Detect click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
      }
    };

    if (showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchRef.current?.value;
    if (query) {
      navigate(`/Search/${encodeURIComponent(query)}`);
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/">
        <img src={logo} alt="Logo" className="logo-img" />
      </Link>

      <div className="navbar-right">
        <CategoryDropdown />
        {(isAuthenticated && isAdmin) && <Link to="/admin">Admin</Link>}

        {/* ✅ Wrap with ref */}
        <div className="search-wrapper" ref={searchContainerRef}>
          <SearchIcon
            className="icon"
            onClick={() => setShowSearch(!showSearch)}
          />
          {showSearch && (
            <form onSubmit={handleSubmit} className="search-form">
              <input
                ref={searchRef}
                type="text"
                className="search-input animated"
                placeholder="Rechercher..."
              />
              <button type="submit" className="search-btn">
                <SearchIcon fontSize="small" />
              </button>
            </form>
          )}
        </div>

        <Link to="/Cart">
          <ShoppingCartIcon className="icon" />
        </Link>
        {isAuthenticated ? <UserDropdown /> : (
          <Link to="/login">
            <LoginIcon className="icon" />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
