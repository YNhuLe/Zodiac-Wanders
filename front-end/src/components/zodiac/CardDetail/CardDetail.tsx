import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchZodiacById, getFlowerImageUrl } from "../../../services/api";
import { getCompatibility, getElement } from "../../../data/compatibility";
import type { ZodiacEntry } from "../../../types";
import CompatibilityCard from "../../compatibility/CompatibilityCard/CompatibilityCard";
import ZodiacBadge from "../../ui/ZodiacBadge/ZodiacBadge";
import "./CardDetail.scss";

export default function CardDetail() {
  const [zodiac, setZodiac] = useState<ZodiacEntry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;
    setZodiac(null);
    setError(null);
    fetchZodiacById(id)
      .then(setZodiac)
      .catch(() => setError("Unable to load zodiac details."));
  }, [id]);

  if (error) {
    return <div className="card-detail__loading" role="alert">{error}</div>;
  }

  if (!zodiac) {
    return <div className="card-detail__loading" role="status">Loading zodiac details...</div>;
  }

  const compat = getCompatibility(zodiac.zodiac);
  const element = getElement(zodiac.zodiac);
  const dailyHoroscope = zodiac.horoscope?.daily
    ? Object.values(zodiac.horoscope.daily).slice(-1)[0]
    : zodiac.horoscope?.weekly;

  return (
    <div className="card-detail page-section">
      <div className="container">
        <nav className="card-detail__breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true"> / </span>
          <span>{zodiac.zodiac}</span>
        </nav>

        <div className="card-detail__hero">
          <div className="card-detail__hero-text">
            <img src={zodiac.icon} alt="" className="card-detail__icon" width="80" height="80" />
            <h1 className="card-detail__title">{zodiac.zodiac}</h1>
            <p className="card-detail__dates">{zodiac.date_range}</p>
            <div className="card-detail__badges">
              <ZodiacBadge sign={element} size="lg" />
              <span className="card-detail__meta">{zodiac.planet} · {zodiac.color}</span>
            </div>
          </div>
          <div className="card-detail__hero-image">
            <img
              src={getFlowerImageUrl(zodiac.image_url)}
              alt={`${zodiac.flower} — flower of ${zodiac.zodiac}`}
              className="card-detail__flower-img"
              loading="lazy"
            />
          </div>
        </div>

        <div className="card-detail__grid">
          <section className="card-detail__panel" aria-labelledby="about-heading">
            <h2 id="about-heading" className="card-detail__panel-title">About {zodiac.zodiac}</h2>
            <p className="card-detail__summary">{zodiac.personality?.summary || zodiac.description}</p>
            <p className="card-detail__flower-label">
              <strong>Lucky Flower:</strong> {zodiac.flower}
            </p>
            <p className="card-detail__desc">{zodiac.description}</p>
          </section>

          {dailyHoroscope && (
            <section className="card-detail__panel card-detail__panel--horoscope" aria-labelledby="horoscope-heading">
              <h2 id="horoscope-heading" className="card-detail__panel-title">Horoscope</h2>
              <p className="card-detail__horoscope">{dailyHoroscope}</p>
            </section>
          )}

          <section className="card-detail__panel" aria-labelledby="traits-heading">
            <h2 id="traits-heading" className="card-detail__panel-title">Personality Traits</h2>
            <ul className="card-detail__tags">
              {zodiac.personality.traits.map((trait) => (
                <li key={trait} className="card-detail__tag">{trait}</li>
              ))}
            </ul>
          </section>

          <section className="card-detail__panel" aria-labelledby="careers-heading">
            <h2 id="careers-heading" className="card-detail__panel-title">Best Careers</h2>
            <ul className="card-detail__tags">
              {zodiac.best_careers.map((career) => (
                <li key={career} className="card-detail__tag card-detail__tag--career">{career}</li>
              ))}
            </ul>
          </section>
        </div>

        <section className="card-detail__compat-section" aria-labelledby="compat-detail-heading">
          <h2 id="compat-detail-heading" className="section-title">Compatibility</h2>
          <p className="section-subtitle">How {zodiac.zodiac} connects with other signs in love and friendship.</p>

          <h3 className="card-detail__compat-tier">Highly Compatible</h3>
          <div className="card-detail__compat-grid">
            {compat.high.map((match) => (
              <CompatibilityCard key={match.sign} match={match} />
            ))}
          </div>

          <h3 className="card-detail__compat-tier">Moderately Compatible</h3>
          <div className="card-detail__compat-grid">
            {compat.moderate.map((match) => (
              <CompatibilityCard key={match.sign} match={match} />
            ))}
          </div>

          <h3 className="card-detail__compat-tier">Challenging Matches</h3>
          <div className="card-detail__compat-grid">
            {compat.challenging.map((match) => (
              <CompatibilityCard key={match.sign} match={match} />
            ))}
          </div>
        </section>

        {(zodiac.comments?.length ?? 0) > 0 && (
          <section className="card-detail__comments" aria-labelledby="comments-heading">
            <h2 id="comments-heading" className="section-title">Community Thoughts</h2>
            <div className="card-detail__comment-list">
              {zodiac.comments!.map((c) => (
                <div key={c.id} className="card-detail__comment">
                  <strong>{c.user}</strong>
                  <p>{c.message}</p>
                  <span className="card-detail__comment-likes">♥ {c.likes}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
