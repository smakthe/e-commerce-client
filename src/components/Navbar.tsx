import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItemStyles = {
    color: 'var(--color-text-primary)',
    marginLeft: '1.5rem',
    fontWeight: 500,
  };

  return (
    <nav className="navbar glass-panel">
      <div className="container nav-content">
        <Link to="/" className="nav-brand text-gradient">
          EVERYTHING MARKET
        </Link>
        <div className="nav-links">
          <Link to="/products" style={navItemStyles}>Explore</Link>
          {user ? (
            <>
              <Link to="/orders" style={navItemStyles}>Orders</Link>
              <button onClick={handleLogout} className="btn-logout" style={{...navItemStyles, background:'none', border:'none', cursor:'pointer'}}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={navItemStyles}>Login</Link>
              <Link to="/register" style={navItemStyles} className="btn-primary-small">Sign Up</Link>
            </>
          )}
          <div className="cart-indicator" style={navItemStyles}>
            Cart ({items.length})
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
