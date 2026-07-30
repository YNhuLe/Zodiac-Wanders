import { Link } from "react-router-dom";
import { useCommunity } from "../../../context/CommunityContext";
import { getCompatibilityBetween } from "../../../data/compatibility";
import { useUser } from "../../../context/UserContext";
import { useToast } from "../../../context/ToastContext";
import type { User } from "../../../types";
import Avatar from "../../ui/Avatar/Avatar";
import ZodiacBadge from "../../ui/ZodiacBadge/ZodiacBadge";
import Button from "../../ui/Button/Button";
import "./UserCard.scss";

interface UserCardProps {
  user: User;
  showCompat?: boolean;
}

export default function UserCard({ user, showCompat = false }: UserCardProps) {
  const { profile } = useUser();
  const { isFollowing, toggleFollow, addFriend, isFriend } = useCommunity();
  const { addToast } = useToast();
  const compat = profile && showCompat
    ? getCompatibilityBetween(profile.zodiacSign, user.zodiacSign)
    : null;

  return (
    <article className="user-card">
      <Link to={`/profile/${user.id}`} className="user-card__link">
        <Avatar name={user.displayName} src={user.avatar} size="lg" />
        <h3 className="user-card__name">{user.displayName}</h3>
        <ZodiacBadge sign={user.zodiacSign} />
        {user.bio && <p className="user-card__bio">{user.bio}</p>}
      </Link>

      {compat && (
        <div className="user-card__compat" aria-label={`${compat.percent}% compatible`}>
          <div className="user-card__compat-bar">
            <div className="user-card__compat-fill" style={{ width: `${compat.percent}%` }} />
          </div>
          <span>{compat.percent}% match</span>
        </div>
      )}

      {user.hobbies?.length > 0 && (
        <div className="user-card__hobbies">
          {user.hobbies.slice(0, 3).map((h) => (
            <span key={h} className="user-card__hobby">{h}</span>
          ))}
        </div>
      )}

      {profile && profile.id !== user.id && (
        <div className="user-card__actions">
          <Button variant={isFollowing(user.id) ? "primary" : "secondary"} size="sm" onClick={() => toggleFollow(user.id)}>
            {isFollowing(user.id) ? "Following" : "Follow"}
          </Button>
          {!isFriend(user.id) && compat && compat.percent >= 75 && (
            <Button variant="outline" size="sm" onClick={() => { addFriend(user.id); addToast(`Connected with ${user.displayName}!`, "success"); }}>
              Connect
            </Button>
          )}
        </div>
      )}
    </article>
  );
}
