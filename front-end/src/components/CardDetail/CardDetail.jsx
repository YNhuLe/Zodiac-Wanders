import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CardDetails.scss";

function CardDetails() {
  const [zodiac, setZodiac] = useState(null);
  const { id } = useParams();
  const baseUrl = import.meta.env.VITE_API_URL;
  const url = `${baseUrl}/photos/${id}`;

  useEffect(() => {
    console.log("Fetching details for ID:", id);
    console.log("Fetching from:", url);
    const fetchDetails = async () => {
      try {
        const response = await axios.get(url);
        setZodiac(response.data);
        console.log("Details: ", response.data);
      } catch (error) {
        console.error("Error fetching photo details.", error);
      }
    };
    fetchDetails();
  }, [id]);
console.log();

if (!zodiac) {
  return <div className="loading">Loading photos...</div>;
}

return (
  <div className="details">
    <a href="/" className="header-title">
      Zodiac Wonders
    </a>
    <section className="card-details">
      <h2 className="card-details__title">{zodiac.zodiac}</h2>

      <div className="card-details__image-container">
        <img
          className="card-details__image"
          src={`${baseUrl}/images/${zodiac.image_url}`}
          alt={zodiac.zodiac}
        />
      </div>

      <div className="card-details__info">
        <p className="card-details__date">
          <strong>Date Range:</strong> {zodiac.date_range}
        </p>
        <p className="card-details__flower">
          <strong>Flower:</strong> {zodiac.flower}
        </p>
        <p className="card-details__description">
          <strong>Description: </strong>:{zodiac.description}
        </p>
      </div>

      <div className="card-details__traits">
        <h3>Personality Traits</h3>
        <ul className="card-details__list">
          {zodiac.personality.traits.map((trait, index) => (
            <li key={index} className="card-details__list-item">
              {trait}
            </li>
          ))}
        </ul>
      </div>

      <div className="card-details__careers">
        <h3>Best Careers</h3>
        <ul className="card-details__list">
          {zodiac.best_careers.map((career, index) => (
            <li key={index} className="card-details__list-item">
              {career}
            </li>
          ))}
        </ul>
      </div>

      <div className="card-details__compatibility">
        <h3>Compatibility</h3>
        <p>
          <strong>Best Matches:</strong>{" "}
          {zodiac.compatibility.best_matches.join(", ")}
        </p>
        <p>
          <strong>Challenging Matches:</strong>{" "}
          {zodiac.compatibility.challenging_matches.join(", ")}
        </p>
      </div>
    </section>
  </div>
);
}

export default CardDetails;
