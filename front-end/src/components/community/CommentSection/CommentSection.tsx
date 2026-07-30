import { FormEvent, useState } from "react";
import { useCommunity } from "../../../context/CommunityContext";
import { useUser } from "../../../context/UserContext";
import type { Post } from "../../../types";
import Avatar from "../../ui/Avatar/Avatar";
import Button from "../../ui/Button/Button";
import "./CommentSection.scss";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

interface CommentSectionProps {
  post: Post;
}

export default function CommentSection({ post }: CommentSectionProps) {
  const [comment, setComment] = useState("");
  const [expanded, setExpanded] = useState(false);
  const { addComment, getUserById } = useCommunity();
  const { profile } = useUser();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !profile) return;
    await addComment(post.id, comment.trim());
    setComment("");
  };

  return (
    <div className="comments">
      <button className="comments__toggle" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
        {expanded ? "Hide" : "View"} {post.comments.length} comment{post.comments.length !== 1 ? "s" : ""}
      </button>

      {expanded && (
        <div className="comments__body">
          {post.comments.map((c) => {
            const author = getUserById(c.userId);
            return (
              <div key={c.id} className="comments__item">
                {author && <Avatar name={author.displayName} src={author.avatar} size="sm" />}
                <div>
                  <span className="comments__author">{author?.displayName || "Unknown"}</span>
                  <time className="comments__time" dateTime={c.createdAt}>{formatDate(c.createdAt)}</time>
                  <p className="comments__text">{c.content}</p>
                </div>
              </div>
            );
          })}

          {profile ? (
            <form className="comments__form" onSubmit={handleSubmit}>
              <label htmlFor={`comment-${post.id}`} className="sr-only">Add a comment</label>
              <input
                id={`comment-${post.id}`}
                className="comments__input"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                maxLength={300}
              />
              <Button type="submit" size="sm" disabled={!comment.trim()}>Reply</Button>
            </form>
          ) : (
            <p className="comments__login">Sign in to join the conversation.</p>
          )}
        </div>
      )}
    </div>
  );
}
