import { Link } from "react-router-dom";
import { useZodiacs } from "../../../hooks/useZodiacs";
import { getMatchTier } from "../../../data/compatibility";
import type { CompatibilityMatch } from "../../../types";
import "./CompatibilityCard.scss";

interface CompatibilityCardProps {
  match: CompatibilityMatch;
}

export default function CompatibilityCard({ match }: CompatibilityCardProps) {
  const tier = getMatchTier(match.percent);
  const { zodiacs } = useZodiacs();
  const signData = zodiacs.find((z) => z.zodiac === match.sign);

  const content = (
    <div className={`compat-card compat-card--${tier}`}>
      <div className="compat-card__header">
        {signData && (
          <img src={signData.icon} alt="" className="compat-card__icon" loading="lazy" width="40" height="40" />
        )}
        <div>
          <p className="compat-card__sign">{match.sign}</p>
          <span className="compat-card__tier">
            {tier === "high" ? "Highly Compatible" : tier === "moderate" ? "Moderately Compatible" : "Challenging Match"}
          </span>
        </div>
      </div>
      <div className="compat-card__percent" aria-label={`${match.percent} percent compatible`}>
        <div className="compat-card__bar">
          <div className="compat-card__fill" style={{ width: `${match.percent}%` }} />
        </div>
        <span className="compat-card__value">{match.percent}%</span>
      </div>
      <p className="compat-card__reason">{match.reason}</p>
    </div>
  );

  if (signData) {
    return <Link to={`/photos/${signData.id}`} className="compat-card__link">{content}</Link>;
  }
  return content;
}
