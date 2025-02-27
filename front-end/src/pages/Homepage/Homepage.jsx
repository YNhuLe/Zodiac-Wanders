import React from "react";
import Header from "../../components/Header/Header";
import ZodiacCard from "../../components/Cards/ZodiacCard";
import Footer from "../../components/Footer/Footer";

function Homepage() {
  return (
    <>
      <Header />
      <ZodiacCard />
      <Header />
      <Footer />
    </>
  );
}

export default Homepage;
