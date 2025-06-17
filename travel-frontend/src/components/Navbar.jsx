import { Link, useNavigate } from "react-router-dom";
import '../App.css';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          Travel Management
        </Link>
        
        <div className="nav-links">
          {user ? (
            <>
              <span className="welcome">
                Welcome, <strong>{user.username}</strong>
                {user.roles && (
                  <span className="roles">
                    ({user.roles.map(r => r.authority).join(", ")})
                  </span>
                )}
              </span>
              
              <Link to="/packages">Packages</Link>
              
              {user.roles?.some(r => r.authority === "USER") && (
                <Link to="/chat">Group Chat</Link>
              )}
              
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;