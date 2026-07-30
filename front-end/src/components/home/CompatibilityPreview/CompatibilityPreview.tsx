import { Link } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import { getCompatibility } from "../../../data/compatibility";
import CompatibilityCard from "../../compatibility/CompatibilityCard/CompatibilityCard";
import Button from "../../ui/Button/Button";
import "./CompatibilityPreview.scss";

export default function CompatibilityPreview() {
  const { profile } = useUser();
  const sign = profile?.zodiacSign || "Aries";
  const compat = getCompatibility(sign);

  return (
    <section className="compat-preview page-section" aria-labelledby="compat-preview-heading">
      <div className="container">
        <h2 id="compat-preview-heading" className="section-title">Zodiac Compatibility</h2>
        <p className="section-subtitle">
          {profile
            ? `Based on your ${sign} sign, here are your cosmic matches.`
            : "Create a profile to see your personalized matches, or explore Aries compatibility below."}
        </p>

        <div className="compat-preview__grid">
          {compat.high.slice(0, 3).map((match) => (
            <CompatibilityCard key={match.sign} match={match} />
          ))}
        </div>

        <div className="compat-preview__cta">
          <Link to="/compatibility" aria-label="Explore full zodiac compatibility">
            <Button variant="secondary">Explore Full Compatibility</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
