import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import Button from "../../ui/Button/Button";
import "./Hero.scss";

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero__stars" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} className="hero__star" style={{ "--i": i } as CSSProperties} />
        ))}
      </div>

      <div className="hero__content container">
        <p className="hero__eyebrow">Welcome to the Zodiac World</p>
        <h1 id="hero-heading" className="hero__title">
          Discover Your Zodiac,<br />
          <span className="hero__title-accent">Connect Your Soul</span>
        </h1>
        <p className="hero__subtitle">
          Explore all 12 zodiac signs, find your cosmic matches, and join a community
          of kindred spirits who share your love of astrology, flowers, and self-discovery.
        </p>
        <div className="hero__actions">
          <a href="#zodiac-grid" aria-label="Explore all zodiac signs">
            <Button size="lg">Explore Signs</Button>
          </a>
          <Link to="/profile/create" aria-label="Create your profile">
            <Button variant="outline" size="lg">Create Your Profile</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
