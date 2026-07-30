import { useZodiacs } from "../../../hooks/useZodiacs";
import ZodiacCard from "../ZodiacCard/ZodiacCard";
import "./ZodiacGrid.scss";

export default function ZodiacGrid() {
  const { zodiacs, loading, error } = useZodiacs();

  if (loading) {
    return <div className="zodiac-grid__loading" role="status">Loading zodiac signs...</div>;
  }

  if (error) {
    return <div className="zodiac-grid__error" role="alert">Unable to load zodiac signs. Please try again later.</div>;
  }

  return (
    <section id="zodiac-grid" className="zodiac-grid page-section" aria-labelledby="zodiac-grid-heading">
      <div className="container">
        <h2 id="zodiac-grid-heading" className="section-title">Discover Your Sign</h2>
        <p className="section-subtitle">
          Explore all 12 zodiac signs — each with unique personality traits, lucky flowers, and cosmic insights.
        </p>
        <div className="zodiac-grid__cards">
          {zodiacs.map((zodiac) => (
            <ZodiacCard key={zodiac.id} zodiac={zodiac} />
          ))}
        </div>
      </div>
    </section>
  );
}
