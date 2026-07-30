import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import { useTheme } from "../../../context/ThemeContext";
import Avatar from "../../ui/Avatar/Avatar";
import logo from "../../../assets/images/logo.png";
import "./Navbar.scss";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/community", label: "Community" },
  { to: "/compatibility", label: "Compatibility" },
  { to: "/cosmic-connections", label: "Cosmic Connections" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { profile, isLoggedIn, logout } = useUser();
  const { resolvedTheme, toggleTheme } = useTheme();

  const closeMenu = () => setMenuOpen(false);

  return (
    <header>
      <nav className="navbar" aria-label="Main navigation">
        <div className="navbar__inner container">
          <Link to="/" className="navbar__brand" onClick={closeMenu} aria-label="Zodiac Wanders — Home">
            <img src={logo} alt="" className="navbar__logo" width="40" height="40" aria-hidden="true" />
            <span className="navbar__brand-text" aria-hidden="true">Zodiac Wanders</span>
          </Link>

          <div className="navbar__actions">
            <button
              className="navbar__theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${resolvedTheme === "light" ? "dark" : "light"} mode`}
            >
              <span aria-hidden="true">{resolvedTheme === "light" ? "🌙" : "☀️"}</span>
              <span className="sr-only">{resolvedTheme === "light" ? "Dark mode" : "Light mode"}</span>
            </button>

            <button
              className={`navbar__toggle ${menuOpen ? "navbar__toggle--open" : ""}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="nav-menu"
              aria-label="Toggle navigation menu"
            >
              <span />
              <span />
              <span />
            </button>
          </div>

          <div id="nav-menu" className={`navbar__menu ${menuOpen ? "navbar__menu--open" : ""}`}>
            <ul className="navbar__links" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className={({ isActive }) => `navbar__link ${isActive ? "navbar__link--active" : ""}`}
                    onClick={closeMenu}
                    end={link.to === "/"}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="navbar__user-actions">
              {isLoggedIn ? (
                <>
                  <Link to="/profile" className="navbar__profile" onClick={closeMenu}>
                    <Avatar name={profile!.displayName} src={profile!.avatar} size="sm" />
                    <span className="navbar__profile-name">{profile!.displayName}</span>
                  </Link>
                  <button className="navbar__logout" onClick={() => { logout(); closeMenu(); }}>
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="navbar__login" onClick={closeMenu}>Sign In</Link>
                  <Link to="/profile/create" className="navbar__profile" onClick={closeMenu}>
                    <span className="navbar__profile-cta">Join Free</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
