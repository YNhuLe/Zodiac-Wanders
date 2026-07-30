import { Link } from "react-router-dom";
import { getElement } from "../../../data/compatibility";
import type { ZodiacEntry } from "../../../types";
import "./ZodiacCard.scss";

interface ZodiacCardProps {
  zodiac: ZodiacEntry;
}

export default function ZodiacCard({ zodiac }: ZodiacCardProps) {
  const element = getElement(zodiac.zodiac);

  return (
    <Link to={`/photos/${zodiac.id}`} className="zodiac-card" aria-label={`View ${zodiac.zodiac} details`}>
      <div className="zodiac-card__inner">
        <img
          src={zodiac.icon}
          alt=""
          className="zodiac-card__icon"
          loading="lazy"
          width="64"
          height="64"
        />
        <h3 className="zodiac-card__name">{zodiac.zodiac}</h3>
        <p className="zodiac-card__dates">{zodiac.date_range}</p>
        <span className="zodiac-card__element">{element}</span>
        <p className="zodiac-card__flower">{zodiac.flower}</p>
      </div>
    </Link>
  );
}
