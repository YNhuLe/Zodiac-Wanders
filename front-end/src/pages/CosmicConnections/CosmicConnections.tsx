import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useCommunity } from "../../context/CommunityContext";
import { useUser } from "../../context/UserContext";
import { getCompatibilityBetween } from "../../data/compatibility";
import UserCard from "../../components/profile/UserCard/UserCard";
import Button from "../../components/ui/Button/Button";
import "./CosmicConnections.scss";

export default function CosmicConnections() {
  const { profile } = useUser();
  const { users, friends } = useCommunity();

  const otherUsers = users.filter((u) => u.id !== profile?.id);

  const matches = useMemo(() => {
    if (!profile) return [];
    return otherUsers
      .map((user) => ({
        user,
        compat: getCompatibilityBetween(profile.zodiacSign, user.zodiacSign),
      }))
      .sort((a, b) => b.compat.percent - a.compat.percent);
  }, [profile, otherUsers]);

  const topMatches = matches.filter((m) => m.compat.percent >= 75);
  const friendsList = users.filter((u) => friends.includes(u.id));

  if (!profile) {
    return (
      <div className="cosmic-page page-section">
        <div className="container cosmic-page__empty">
          <div className="cosmic-page__hero-card">
            <h1 className="section-title">Cosmic Connections</h1>
            <p className="section-subtitle">
              Discover compatible zodiac matches, make friends, and connect with people who share
              your love of astrology, flowers, and self-discovery.
            </p>
            <Link to="/profile/create">
              <Button size="lg">Create Your Account</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cosmic-page page-section">
      <div className="container">
        <header className="cosmic-page__header">
          <h1 className="section-title">Cosmic Connections</h1>
          <p className="section-subtitle">
            As a {profile.zodiacSign}, discover kindred spirits aligned with your cosmic energy.
          </p>
        </header>

        {friendsList.length > 0 && (
          <section className="cosmic-page__section" aria-labelledby="friends-heading">
            <h2 id="friends-heading" className="cosmic-page__section-title">Your Connections</h2>
            <div className="cosmic-page__grid">
              {friendsList.map((user) => (
                <UserCard key={user.id} user={user} showCompat />
              ))}
            </div>
          </section>
        )}

        <section className="cosmic-page__section" aria-labelledby="matches-heading">
          <h2 id="matches-heading" className="cosmic-page__section-title">Top Cosmic Matches</h2>
          <div className="cosmic-page__grid">
            {topMatches.map(({ user }) => (
              <UserCard key={user.id} user={user} showCompat />
            ))}
          </div>
        </section>

        {matches.length > topMatches.length && (
          <section className="cosmic-page__section" aria-labelledby="all-heading">
            <h2 id="all-heading" className="cosmic-page__section-title">Explore All Members</h2>
            <div className="cosmic-page__grid">
              {matches
                .filter((m) => m.compat.percent < 75)
                .map(({ user }) => (
                  <UserCard key={user.id} user={user} showCompat />
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
