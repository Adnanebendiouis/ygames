import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdDashboard, MdShoppingCart, MdLogout, MdProductionQuantityLimits,  MdMenu, MdClose } from 'react-icons/md';
import './styles.css';
import { AuthContext } from "../context/auth-context";
import { useContext, useState, useEffect } from 'react';
import ygames from '../images/Y game LOGO 2[1].pdf (60 x 60 px).svg';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  // Keep a body-level class in sync so other layout elements (the admin content wrapper)
  // can shift when the sidebar is visible. On desktop the sidebar should be visible
  // by default; on small screens it's controlled by the burger button.
  useEffect(() => {
    const updateBodyClass = () => {
      const shouldShow = isOpen || window.innerWidth > 768;
      document.body.classList.toggle('admin-sidebar-open', shouldShow);
    };

    updateBodyClass();
    window.addEventListener('resize', updateBodyClass);
    return () => window.removeEventListener('resize', updateBodyClass);
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
          <Link to="/admin" className={isActive('/admin')} onClick={() => setIsOpen(false)}>
            <MdDashboard /> Dashboard
          </Link>
          <Link to="/admin/products" className={isActive('/admin/products')} onClick={() => setIsOpen(false)}>
            <MdProductionQuantityLimits /> Produits
          </Link>
          <Link to="/admin/orders" className={isActive('/admin/orders')} onClick={() => setIsOpen(false)}>
            <MdShoppingCart /> Commandes
          </Link>
          <button className="logout-button" onClick={() => { handleLogout(); setIsOpen(false); }}>
            <MdLogout /> Déconnexion
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
