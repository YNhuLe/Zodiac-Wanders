import { getAvatarUrl } from "../../../services/api";
import "./Avatar.scss";

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Avatar({ src, name, size = "md" }: AvatarProps) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const resolvedSrc = src ? getAvatarUrl(src) : null;

  return (
    <div className={`avatar avatar--${size}`} role="img" aria-label={name ? `${name}'s avatar` : "User avatar"}>
      {resolvedSrc ? (
        <img src={resolvedSrc} alt="" className="avatar__img" loading="lazy" width={size === "xl" ? 96 : 40} height={size === "xl" ? 96 : 40} />
      ) : (
        <span className="avatar__initials" aria-hidden="true">{initials}</span>
      )}
    </div>
  );
}
