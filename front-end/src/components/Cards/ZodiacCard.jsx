import axios from "axios";
import { useEffect, useState } from "react";
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

  if (!photos) {
    return <>Loading photo...</>;
  }

  //   const { id, zodiac, date_range } = photos;
  return (
    <section className="section">
      {photos.map((photo) => {
        return (
          <div key={photo.id} className="card">
            <p className="card__zodiac">{photo.zodiac}</p>
            <p className="card__date">{photo.date_range}</p>
            <p></p>
          </div>
        );
      })}
    </section>
  );
}

export default ZodiacCard;
