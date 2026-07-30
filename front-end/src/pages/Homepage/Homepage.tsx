import Hero from "../../components/layout/Hero/Hero";
import ZodiacGrid from "../../components/zodiac/ZodiacGrid/ZodiacGrid";
import CompatibilityPreview from "../../components/home/CompatibilityPreview/CompatibilityPreview";
import CommunityPreview from "../../components/home/CommunityPreview/CommunityPreview";

export default function Homepage() {
  return (
    <>
      <Hero />
      <ZodiacGrid />
      <CompatibilityPreview />
      <CommunityPreview />
    </>
  );
}
