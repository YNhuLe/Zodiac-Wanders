import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { ZODIAC_SIGNS, getCompatibility } from "../../data/compatibility";
import CompatibilityCard from "../../components/compatibility/CompatibilityCard/CompatibilityCard";
import "./Compatibility.scss";

export default function Compatibility() {
  const { profile } = useUser();
  const [selectedSign, setSelectedSign] = useState(profile?.zodiacSign || "Aries");
  const compat = getCompatibility(selectedSign);

  return (
    <div className="compatibility-page page-section">
      <div className="container">
        <header className="compatibility-page__header">
          <h1 className="section-title">Zodiac Compatibility</h1>
          <p className="section-subtitle">
            Discover how your sign connects with others — from cosmic soulmates to growth-oriented challenges.
          </p>
        </header>

        <div className="compatibility-page__selector">
          <label htmlFor="sign-select" className="compatibility-page__label">Select a zodiac sign</label>
          <select
            id="sign-select"
            className="compatibility-page__select"
            value={selectedSign}
            onChange={(e) => setSelectedSign(e.target.value)}
          >
            {ZODIAC_SIGNS.map((sign) => (
              <option key={sign} value={sign}>{sign}</option>
            ))}
          </select>
        </div>

        <section className="compatibility-page__tier" aria-labelledby="high-heading">
          <h2 id="high-heading" className="compatibility-page__tier-title compatibility-page__tier-title--high">
            Highly Compatible
          </h2>
          <div className="compatibility-page__grid">
            {compat.high.map((match) => (
              <CompatibilityCard key={match.sign} match={match} />
            ))}
          </div>
        </section>

        <section className="compatibility-page__tier" aria-labelledby="moderate-heading">
          <h2 id="moderate-heading" className="compatibility-page__tier-title compatibility-page__tier-title--moderate">
            Moderately Compatible
          </h2>
          <div className="compatibility-page__grid">
            {compat.moderate.map((match) => (
              <CompatibilityCard key={match.sign} match={match} />
            ))}
          </div>
        </section>

        <section className="compatibility-page__tier" aria-labelledby="challenging-heading">
          <h2 id="challenging-heading" className="compatibility-page__tier-title compatibility-page__tier-title--challenging">
            Challenging Matches
          </h2>
          <div className="compatibility-page__grid">
            {compat.challenging.map((match) => (
              <CompatibilityCard key={match.sign} match={match} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
