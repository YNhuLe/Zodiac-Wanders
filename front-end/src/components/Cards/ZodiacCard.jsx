import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ZodiacCard.scss";

function ZodiacCard() {
  const [photos, setPhotos] = useState([]);
  const baseUrl = import.meta.env.VITE_API_URL;
  const url = `${baseUrl}/photos`;

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get(url);
        setPhotos(response.data);
        console.log("Photos: ", response.data);
      } catch (error) {
        console.error("Error fetching photo details.", error);
      }
    };
    fetchPhotos();
  }, []);

  if (!photos.length) {
    return <>Loading photos...</>;
  }

  return (
    <section className="section">
      <div className="allcards">
        {photos.map((photo) => (
          <Link key={photo.id} to={`/photos/${photo.id}`} className="card-link">
            <div className="card">
              <p className="card__zodiac">{photo.zodiac}</p>
              <p className="card__date">{photo.date_range}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default ZodiacCard;
