import { Link } from "react-router-dom";
import { useCommunity } from "../../../context/CommunityContext";
import { useUser } from "../../../context/UserContext";
import type { Post } from "../../../types";
import Avatar from "../../ui/Avatar/Avatar";
import ZodiacBadge from "../../ui/ZodiacBadge/ZodiacBadge";
import "./PostCard.scss";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface PostCardProps {
  post: Post;
  compact?: boolean;
}

export default function PostCard({ post, compact = false }: PostCardProps) {
  const { getUserById, toggleLike, isFollowing, toggleFollow } = useCommunity();
  const { profile } = useUser();
  const author = getUserById(post.userId);
  const liked = !!(profile && post.likes.includes(profile.id));

  if (!author) return null;

  return (
    <article className={`post-card ${compact ? "post-card--compact" : ""}`}>
      <header className="post-card__header">
        <Link to={`/profile/${author.id}`} className="post-card__author">
          <Avatar name={author.displayName} src={author.avatar} size="md" />
          <div>
            <span className="post-card__name">{author.displayName}</span>
            <div className="post-card__meta">
              <ZodiacBadge sign={author.zodiacSign} size="sm" />
              <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
            </div>
          </div>
        </Link>
        {profile && profile.id !== author.id && !compact && (
          <button
            className={`post-card__follow ${isFollowing(author.id) ? "post-card__follow--active" : ""}`}
            onClick={() => toggleFollow(author.id)}
            aria-pressed={isFollowing(author.id)}
          >
            {isFollowing(author.id) ? "Following" : "Follow"}
          </button>
        )}
      </header>

      <p className="post-card__content">{post.content}</p>

      <footer className="post-card__footer">
        <button
          className={`post-card__action ${liked ? "post-card__action--active" : ""}`}
          onClick={() => toggleLike(post.id)}
          aria-pressed={liked}
          disabled={!profile}
          aria-label={`${post.likes.length} likes`}
        >
          <span aria-hidden="true">♥</span> {post.likes.length}
        </button>
        <span className="post-card__action" aria-label={`${post.comments.length} comments`}>
          <span aria-hidden="true">💬</span> {post.comments.length}
        </span>
      </footer>
    </article>
  );
}
