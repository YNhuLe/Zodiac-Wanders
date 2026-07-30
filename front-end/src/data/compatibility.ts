import type { CompatibilityData, CompatibilityMatch } from "../types";

const ELEMENTS: Record<string, string> = {
  Aries: "Fire", Leo: "Fire", Sagittarius: "Fire",
  Taurus: "Earth", Virgo: "Earth", Capricorn: "Earth",
  Gemini: "Air", Libra: "Air", Aquarius: "Air",
  Cancer: "Water", Scorpio: "Water", Pisces: "Water",
};

const COMPATIBILITY_DATA: Record<string, CompatibilityData> = {
  Aries: {
    high: [
      { sign: "Leo", percent: 95, reason: "Two fire signs that fuel each other's passion and ambition." },
      { sign: "Sagittarius", percent: 92, reason: "Adventure-loving spirits who inspire growth and excitement." },
      { sign: "Gemini", percent: 85, reason: "Mental stimulation and playful energy create a dynamic bond." },
    ],
    moderate: [
      { sign: "Aquarius", percent: 78, reason: "Independent thinkers who respect each other's freedom." },
      { sign: "Libra", percent: 72, reason: "Balance meets boldness in a complementary partnership." },
    ],
    challenging: [
      { sign: "Cancer", percent: 45, reason: "Different emotional needs require patience and understanding." },
      { sign: "Capricorn", percent: 52, reason: "Contrasting approaches to life can create friction." },
    ],
  },
  Taurus: {
    high: [
      { sign: "Virgo", percent: 94, reason: "Earth signs who value stability, loyalty, and shared routines." },
      { sign: "Capricorn", percent: 91, reason: "Ambitious and grounded — a power couple in the making." },
      { sign: "Cancer", percent: 88, reason: "Nurturing and devoted, creating a warm home together." },
    ],
    moderate: [
      { sign: "Pisces", percent: 76, reason: "Romantic dreamers who soften Taurus's practical nature." },
      { sign: "Scorpio", percent: 73, reason: "Intense loyalty and deep emotional connection." },
    ],
    challenging: [
      { sign: "Leo", percent: 48, reason: "Stubbornness on both sides can lead to standoffs." },
      { sign: "Aquarius", percent: 42, reason: "Very different values around tradition and change." },
    ],
  },
  Gemini: {
    high: [
      { sign: "Libra", percent: 93, reason: "Intellectual equals who thrive on conversation and culture." },
      { sign: "Aquarius", percent: 90, reason: "Innovative minds that spark endless curiosity." },
      { sign: "Aries", percent: 85, reason: "Playful energy and wit keep the relationship exciting." },
    ],
    moderate: [
      { sign: "Leo", percent: 75, reason: "Social butterflies who light up any room together." },
      { sign: "Sagittarius", percent: 70, reason: "Wanderlust and wonder fuel a lively connection." },
    ],
    challenging: [
      { sign: "Virgo", percent: 50, reason: "Gemini's spontaneity can clash with Virgo's need for order." },
      { sign: "Pisces", percent: 44, reason: "Different communication styles require extra care." },
    ],
  },
  Cancer: {
    high: [
      { sign: "Scorpio", percent: 96, reason: "Deep emotional understanding and unwavering devotion." },
      { sign: "Pisces", percent: 93, reason: "Intuitive souls who create a sanctuary of love." },
      { sign: "Taurus", percent: 88, reason: "Security and tenderness form an unbreakable bond." },
    ],
    moderate: [
      { sign: "Virgo", percent: 77, reason: "Caring and practical — Cancer feels truly supported." },
      { sign: "Capricorn", percent: 71, reason: "Opposite signs that balance emotion with structure." },
    ],
    challenging: [
      { sign: "Aries", percent: 45, reason: "Aries's directness can overwhelm Cancer's sensitivity." },
      { sign: "Libra", percent: 53, reason: "Different needs for closeness vs. social independence." },
    ],
  },
  Leo: {
    high: [
      { sign: "Aries", percent: 95, reason: "Fiery passion and mutual admiration create magic." },
      { sign: "Sagittarius", percent: 91, reason: "Adventurous spirits who celebrate life together." },
      { sign: "Gemini", percent: 82, reason: "Fun-loving pair who never run out of things to do." },
    ],
    moderate: [
      { sign: "Libra", percent: 79, reason: "Charm and grace meet Leo's radiant confidence." },
      { sign: "Aquarius", percent: 68, reason: "Unique connection when both embrace individuality." },
    ],
    challenging: [
      { sign: "Taurus", percent: 48, reason: "Both are fixed signs — compromise is essential." },
      { sign: "Scorpio", percent: 55, reason: "Power struggles can emerge without open communication." },
    ],
  },
  Virgo: {
    high: [
      { sign: "Taurus", percent: 94, reason: "Practical earth signs who build lasting partnerships." },
      { sign: "Capricorn", percent: 92, reason: "Shared goals and work ethic create strong foundations." },
      { sign: "Cancer", percent: 86, reason: "Virgo's care meets Cancer's warmth beautifully." },
    ],
    moderate: [
      { sign: "Scorpio", percent: 78, reason: "Depth and loyalty create a transformative bond." },
      { sign: "Pisces", percent: 74, reason: "Opposite signs who complement each other's gaps." },
    ],
    challenging: [
      { sign: "Gemini", percent: 50, reason: "Virgo's precision can feel restrictive to free-spirited Gemini." },
      { sign: "Sagittarius", percent: 46, reason: "Different priorities around planning vs. spontaneity." },
    ],
  },
  Libra: {
    high: [
      { sign: "Gemini", percent: 93, reason: "Social, witty, and endlessly fascinated by each other." },
      { sign: "Aquarius", percent: 90, reason: "Idealistic partners who champion fairness and growth." },
      { sign: "Leo", percent: 84, reason: "Glamour and grace — a couple that turns heads." },
    ],
    moderate: [
      { sign: "Sagittarius", percent: 76, reason: "Shared love of culture, travel, and new experiences." },
      { sign: "Aries", percent: 72, reason: "Magnetic opposites who learn from each other's strengths." },
    ],
    challenging: [
      { sign: "Cancer", percent: 53, reason: "Libra's social nature may unsettle home-loving Cancer." },
      { sign: "Capricorn", percent: 47, reason: "Different approaches to work-life balance." },
    ],
  },
  Scorpio: {
    high: [
      { sign: "Cancer", percent: 96, reason: "Soul-deep connection built on trust and emotional truth." },
      { sign: "Pisces", percent: 94, reason: "Psychic-level understanding and spiritual intimacy." },
      { sign: "Virgo", percent: 87, reason: "Loyalty and depth create an unshakeable alliance." },
    ],
    moderate: [
      { sign: "Capricorn", percent: 79, reason: "Ambitious and intense — a formidable team." },
      { sign: "Taurus", percent: 73, reason: "Magnetic opposites with powerful physical chemistry." },
    ],
    challenging: [
      { sign: "Leo", percent: 55, reason: "Both want control — vulnerability is the key." },
      { sign: "Aquarius", percent: 43, reason: "Scorpio's depth vs. Aquarius's detachment." },
    ],
  },
  Sagittarius: {
    high: [
      { sign: "Aries", percent: 92, reason: "Fearless explorers who push each other to new heights." },
      { sign: "Leo", percent: 91, reason: "Optimistic fire signs who live life to the fullest." },
      { sign: "Aquarius", percent: 86, reason: "Free spirits united by vision and adventure." },
    ],
    moderate: [
      { sign: "Libra", percent: 76, reason: "Philosophical conversations and shared wanderlust." },
      { sign: "Gemini", percent: 70, reason: "Restless minds that keep each other entertained." },
    ],
    challenging: [
      { sign: "Virgo", percent: 46, reason: "Sagittarius's freedom vs. Virgo's need for routine." },
      { sign: "Pisces", percent: 51, reason: "Different ways of processing emotions and reality." },
    ],
  },
  Capricorn: {
    high: [
      { sign: "Taurus", percent: 93, reason: "Steady, loyal, and focused on building a legacy together." },
      { sign: "Virgo", percent: 92, reason: "Disciplined partners who respect each other's ambition." },
      { sign: "Scorpio", percent: 88, reason: "Intensity and determination create lasting power." },
    ],
    moderate: [
      { sign: "Pisces", percent: 77, reason: "Capricorn grounds Pisces; Pisces softens Capricorn." },
      { sign: "Cancer", percent: 71, reason: "Home and career balance through mutual support." },
    ],
    challenging: [
      { sign: "Aries", percent: 52, reason: "Pace and priorities often diverge." },
      { sign: "Libra", percent: 47, reason: "Capricorn's seriousness vs. Libra's lightness." },
    ],
  },
  Aquarius: {
    high: [
      { sign: "Gemini", percent: 94, reason: "Brilliant minds who innovate and inspire together." },
      { sign: "Libra", percent: 90, reason: "Humanitarian hearts with a shared vision for the world." },
      { sign: "Sagittarius", percent: 86, reason: "Independent adventurers who respect freedom." },
    ],
    moderate: [
      { sign: "Aries", percent: 78, reason: "Rebels and pioneers who challenge the status quo." },
      { sign: "Leo", percent: 68, reason: "Unique chemistry when ego gives way to authenticity." },
    ],
    challenging: [
      { sign: "Taurus", percent: 42, reason: "Aquarius craves change; Taurus craves consistency." },
      { sign: "Scorpio", percent: 43, reason: "Emotional depth vs. intellectual distance." },
    ],
  },
  Pisces: {
    high: [
      { sign: "Scorpio", percent: 95, reason: "Mystical connection that transcends the ordinary." },
      { sign: "Cancer", percent: 93, reason: "Empathetic souls who create a world of their own." },
      { sign: "Capricorn", percent: 85, reason: "Dreamer meets builder in a beautiful balance." },
    ],
    moderate: [
      { sign: "Taurus", percent: 76, reason: "Romance and sensuality in a gentle, loving bond." },
      { sign: "Virgo", percent: 74, reason: "Healing partnership when both embrace vulnerability." },
    ],
    challenging: [
      { sign: "Gemini", percent: 44, reason: "Pisces needs depth; Gemini thrives on variety." },
      { sign: "Sagittarius", percent: 51, reason: "Sensitivity vs. blunt honesty requires care." },
    ],
  },
};

export const ZODIAC_SIGNS = Object.keys(COMPATIBILITY_DATA);

export function getCompatibility(sign: string): CompatibilityData {
  return COMPATIBILITY_DATA[sign] || { high: [], moderate: [], challenging: [] };
}

export function getElement(sign: string): string {
  return ELEMENTS[sign] || "Unknown";
}

export function getMatchTier(percent: number): "high" | "moderate" | "challenging" {
  if (percent >= 85) return "high";
  if (percent >= 65) return "moderate";
  return "challenging";
}

export function getCompatibilityBetween(sign1: string, sign2: string): CompatibilityMatch {
  const data = getCompatibility(sign1);
  const all = [...data.high, ...data.moderate, ...data.challenging];
  const match = all.find((m) => m.sign === sign2);
  if (match) return match;

  const el1 = getElement(sign1);
  const el2 = getElement(sign2);
  if (el1 === el2) {
    return { sign: sign2, percent: 70, reason: `Both ${el1} signs share elemental harmony.` };
  }
  return { sign: sign2, percent: 55, reason: "A relationship that grows through understanding differences." };
}
