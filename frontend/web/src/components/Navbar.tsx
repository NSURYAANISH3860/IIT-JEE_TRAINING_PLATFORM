import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Courses", to: "/courses" },
  { label: "Mock Tests", to: "/mock-test" },
  { label: "AI Coaching", to: "/#agents" },
  { label: "Study Materials", to: "/study-materials" },
  { label: "Rank Predictor", to: "/rank-predictor" },
  { label: "Results", to: "/results" },
  { label: "Pricing", to: "/pricing" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    Boolean(localStorage.getItem("access_token")),
  );

  useEffect(() => {
    function updateAuthState() {
      setIsLoggedIn(Boolean(localStorage.getItem("access_token")));
    }

    window.addEventListener("auth-change", updateAuthState);
    window.addEventListener("storage", updateAuthState);

    return () => {
      window.removeEventListener("auth-change", updateAuthState);
      window.removeEventListener("storage", updateAuthState);
    };
  }, []);

  function logout() {
    localStorage.removeItem("access_token");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/login");
  }

  return (
    <header className="navbar">
      <nav className="nav-inner" aria-label="Main navigation">
        <Link to="/" className="brand" aria-label="VALLURI home">
          <img src={logo} alt="VALLURI logo" className="brand-logo-img" />
          <span className="brand-text">
            <span className="brand-name">
              VALLURI<sup>TM</sup>
            </span>
            <span className="brand-subtitle">IIT-JEE</span>
          </span>
        </Link>

        <div className="nav-links">
          {navItems.map((item) =>
            item.to.includes("#") ? (
              <a key={item.label} href={item.to}>
                {item.label}
              </a>
            ) : (
              <NavLink key={item.label} to={item.to}>
                {item.label}
              </NavLink>
            ),
          )}
        </div>

        <div className="nav-actions">
          {isLoggedIn ? (
            <>
              <NavLink to="/dashboard" className="sign-in-link">
                Dashboard
              </NavLink>
              <button type="button" className="get-started-btn" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="sign-in-link">
                Sign In
              </NavLink>
              <NavLink to="/get-started" className="get-started-btn">
                Get Started
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
