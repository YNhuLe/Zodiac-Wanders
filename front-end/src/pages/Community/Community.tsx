import { Link } from "react-router-dom";
import { useCommunity } from "../../context/CommunityContext";
import { useUser } from "../../context/UserContext";
import { useToast } from "../../context/ToastContext";
import PostCard from "../../components/community/PostCard/PostCard";
import PostForm from "../../components/community/PostForm/PostForm";
import CommentSection from "../../components/community/CommentSection/CommentSection";
import "./Community.scss";

export default function Community() {
  const { posts, createPost, loading } = useCommunity();
  const { isLoggedIn } = useUser();
  const { addToast } = useToast();

  const handlePost = async (content: string) => {
    try {
      await createPost(content);
      addToast("Your post has been shared!", "success");
    } catch {
      addToast("Failed to create post.", "error");
    }
  };

  return (
    <div className="community-page page-section">
      <div className="container community-page__inner">
        <header className="community-page__header">
          <h1 className="section-title">Community</h1>
          <p className="section-subtitle">
            Share your zodiac journey, connect with others, and explore cosmic conversations.
          </p>
        </header>

        {isLoggedIn ? (
          <PostForm onSubmit={handlePost} />
        ) : (
          <div className="community-page__prompt" role="status">
            <Link to="/login">Sign in</Link> or <Link to="/profile/create">create an account</Link> to join the conversation.
          </div>
        )}

        {loading ? (
          <p className="community-page__loading" role="status">Loading community posts...</p>
        ) : (
          <div className="community-page__feed" role="feed" aria-label="Community posts">
            {posts.map((post) => (
              <article key={post.id} className="community-page__post-wrapper" aria-label="Post">
                <PostCard post={post} />
                <CommentSection post={post} />
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
