import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCommunity } from "../../context/CommunityContext";
import { useUser } from "../../context/UserContext";
import { getCompatibility } from "../../data/compatibility";
import Avatar from "../../components/ui/Avatar/Avatar";
import ZodiacBadge from "../../components/ui/ZodiacBadge/ZodiacBadge";
import CompatibilityCard from "../../components/compatibility/CompatibilityCard/CompatibilityCard";
import PostCard from "../../components/community/PostCard/PostCard";
import Button from "../../components/ui/Button/Button";
import "./Profile.scss";

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile: currentUser } = useUser();
  const { getUserById, posts, isFollowing, toggleFollow } = useCommunity();

  const isOwnProfile = !id || id === "current-user";

  useEffect(() => {
    if (isOwnProfile && !currentUser) {
      navigate("/login");
    }
  }, [isOwnProfile, currentUser, navigate]);

  const user = isOwnProfile ? currentUser : getUserById(id);

  if (isOwnProfile && !currentUser) return null;

  if (!user) {
    return (
      <div className="profile-page page-section">
        <div className="container profile-page__empty">
          <h1>Profile not found</h1>
          <Link to="/"><Button>Go Home</Button></Link>
        </div>
      </div>
    );
  }

  const compat = getCompatibility(user.zodiacSign);
  const userPosts = posts.filter((p) => p.userId === user.id);
  const joinedDate = user.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently";

  return (
    <div className="profile-page page-section">
      <div className="container">
        <div className="profile-page__header-card">
          <Avatar name={user.displayName} src={user.avatar} size="xl" />
          <div className="profile-page__info">
            <h1 className="profile-page__name">{user.displayName}</h1>
            <ZodiacBadge sign={user.zodiacSign} size="lg" />
            {user.age && <p className="profile-page__detail">Age: {user.age}</p>}
            {user.bio && <p className="profile-page__bio">{user.bio}</p>}
            {user.favoriteFlower && (
              <p className="profile-page__detail">Favorite Flower: {user.favoriteFlower}</p>
            )}
            {user.hobbies?.length > 0 && (
              <div className="profile-page__hobbies">
                {user.hobbies.map((h) => (
                  <span key={h} className="profile-page__hobby">{h}</span>
                ))}
              </div>
            )}
            <p className="profile-page__joined">Joined {joinedDate}</p>

            <div className="profile-page__actions">
              {isOwnProfile ? (
                <Link to="/profile/edit"><Button variant="secondary">Edit Profile</Button></Link>
              ) : currentUser && (
                <Button
                  variant={isFollowing(user.id) ? "primary" : "secondary"}
                  onClick={() => toggleFollow(user.id)}
                >
                  {isFollowing(user.id) ? "Following" : "Follow"}
                </Button>
              )}
            </div>
          </div>
        </div>

        <section className="profile-page__section" aria-labelledby="compat-heading">
          <h2 id="compat-heading" className="section-title">Compatibility Matches</h2>
          <div className="profile-page__compat-grid">
            {compat.high.slice(0, 2).map((m) => (
              <CompatibilityCard key={m.sign} match={m} />
            ))}
          </div>
        </section>

        {userPosts.length > 0 && (
          <section className="profile-page__section" aria-labelledby="activity-heading">
            <h2 id="activity-heading" className="section-title">Community Activity</h2>
            <div className="profile-page__posts">
              {userPosts.map((post) => (
                <PostCard key={post.id} post={post} compact />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
