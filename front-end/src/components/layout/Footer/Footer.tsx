import { Link } from "react-router-dom";
import "./Footer.scss";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <Link to="/" className="site-footer__title">Zodiac Wanders</Link>
          <p className="site-footer__tagline">
            Discover your sign, connect with kindred spirits, and explore the cosmos together.
          </p>
        </div>

        <nav className="site-footer__nav" aria-label="Footer navigation">
          <div className="site-footer__col">
            <h3 className="site-footer__heading">Explore</h3>
            <Link to="/" className="site-footer__link">Zodiac Signs</Link>
            <Link to="/compatibility" className="site-footer__link">Compatibility</Link>
            <Link to="/cosmic-connections" className="site-footer__link">Cosmic Connections</Link>
          </div>
          <div className="site-footer__col">
            <h3 className="site-footer__heading">Community</h3>
            <Link to="/community" className="site-footer__link">Discussions</Link>
            <Link to="/profile/create" className="site-footer__link">Create Profile</Link>
          </div>
        </nav>
      </div>
      <div className="site-footer__bottom container">
        <p>&copy; {new Date().getFullYear()} Zodiac Wanders. Made with cosmic love.</p>
      </div>
    </footer>
  );
}
