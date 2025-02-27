import React from "react";
import Header from "../../components/Header/Header";
import ZodiacCard from "../../components/Cards/ZodiacCard";
import Footer from "../../components/Footer/Footer";
import CardDetails from "../../components/CardDetail/CardDetail";

function Homepage() {
  return (
    <>
      <Header />
      <ZodiacCard />
      <Footer />
    </>
  );
}

export default Homepage;
