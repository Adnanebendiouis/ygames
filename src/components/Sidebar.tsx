import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdDashboard, MdShoppingCart, MdLogout, MdProductionQuantityLimits, MdMenu, MdClose } from 'react-icons/md';
import './styles.css';
import { AuthContext } from "../context/auth-context";
import { useContext, useState, useEffect } from 'react';
import ygames from '../images/Y game LOGO 2[1].pdf (60 x 60 px).svg';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const updateBodyClass = () => {
      const shouldShow = isOpen || window.innerWidth > 768;
      document.body.classList.toggle('admin-sidebar-open', shouldShow);
    };
    updateBodyClass();
    window.addEventListener('resize', updateBodyClass);
    return () => window.removeEventListener('resize', updateBodyClass);
  }, [isOpen]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const handleLinkClick = () => {
    // Only close on mobile
    if (window.innerWidth <= 768) {
      setIsOpen(false);
    }
  };

  // Prevent clicks inside sidebar from closing it
  // const handleSidebarClick = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  // };

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === path ? 'active-link' : '';
    }
    return location.pathname.startsWith(path) ? 'active-link' : '';
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? <MdClose /> : <MdMenu />}
      </button>

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(false)}
      ></div>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="profile-section">
          <img className="profile-img" src={ygames} alt="YGAMES Logo" />
          <p className="profile-name">YGAMES</p>
          <p className="profile-email">admin</p>
        </div>
        <nav>
          <Link 
            to="/admin" 
            className={isActive('/admin')} 
            onClick={handleLinkClick}
          >
            <MdDashboard /> Dashboard
          </Link>
          <Link 
            to="/admin/products" 
            className={isActive('/admin/products')} 
            onClick={handleLinkClick}
          >
            <MdProductionQuantityLimits /> Produits
          </Link>
          <Link 
            to="/admin/orders" 
            className={isActive('/admin/orders')} 
            onClick={handleLinkClick}
          >
            <MdShoppingCart /> Commandes
          </Link>
          <button className="logout-button" onClick={handleLogout}>
            <MdLogout /> Déconnexion
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;