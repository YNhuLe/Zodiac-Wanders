import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Navigate, useLocation } from "react-router-dom";
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

  if (!zodiac) {
    return <>Loading photos...</>;
  }
  return (
    <section>
      <h2>{zodiac.zodiac}</h2>
      <div>
        <img src={zodiac.image_url} alt={zodiac.zodiac} />
      </div>

      <div>
        <p>{zodiac.date_range}</p>
        <p>{zodiac.flower}</p>
        <p>{zodiac.description}</p>
      </div>
    </section>
  );
}
export default CardDetails;
