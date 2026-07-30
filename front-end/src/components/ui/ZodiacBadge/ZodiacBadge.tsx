import "./ZodiacBadge.scss";

interface ZodiacBadgeProps {
  sign: string;
  size?: "sm" | "md" | "lg";
}

export default function ZodiacBadge({ sign, size = "md" }: ZodiacBadgeProps) {
  return (
    <span className={`zodiac-badge zodiac-badge--${size}`} aria-label={`Zodiac sign: ${sign}`}>
      {sign}
    </span>
  );
}
