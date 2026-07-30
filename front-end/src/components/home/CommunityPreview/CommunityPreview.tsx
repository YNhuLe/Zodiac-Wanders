import { Link } from "react-router-dom";
import { useCommunity } from "../../../context/CommunityContext";
import PostCard from "../../community/PostCard/PostCard";
import Button from "../../ui/Button/Button";
import "./CommunityPreview.scss";

export default function CommunityPreview() {
  const { posts, users } = useCommunity();
  const recentPosts = posts.slice(0, 3);

  return (
    <section className="community-preview page-section" aria-labelledby="community-preview-heading">
      <div className="container">
        <h2 id="community-preview-heading" className="section-title">Community Highlights</h2>
        <p className="section-subtitle">
          Join {users.length}+ members sharing thoughts, experiences, and zodiac wisdom.
        </p>

        <div className="community-preview__stats">
          <div className="community-preview__stat">
            <span className="community-preview__stat-value">{posts.length}</span>
            <span className="community-preview__stat-label">Discussions</span>
          </div>
          <div className="community-preview__stat">
            <span className="community-preview__stat-value">{users.length}</span>
            <span className="community-preview__stat-label">Active Members</span>
          </div>
          <div className="community-preview__stat">
            <span className="community-preview__stat-value">
              {posts.reduce((sum, p) => sum + p.likes.length, 0)}
            </span>
            <span className="community-preview__stat-label">Likes Given</span>
          </div>
        </div>

        <div className="community-preview__posts">
          {recentPosts.map((post) => (
            <PostCard key={post.id} post={post} compact />
          ))}
        </div>

        <div className="community-preview__cta">
          <Link to="/community">
            <Button>Join the Community</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
