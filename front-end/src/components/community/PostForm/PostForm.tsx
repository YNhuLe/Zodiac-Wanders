import { FormEvent, useState } from "react";
import Button from "../../ui/Button/Button";
import "./PostForm.scss";

interface PostFormProps {
  onSubmit: (content: string) => void;
}

export default function PostForm({ onSubmit }: PostFormProps) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim());
    setContent("");
  };

  return (
    <form className="post-form" onSubmit={handleSubmit} aria-label="Create a new post">
      <label htmlFor="post-content" className="sr-only">Write a post</label>
      <textarea
        id="post-content"
        className="post-form__input"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your zodiac thoughts, experiences, or cosmic discoveries..."
        rows={3}
        maxLength={500}
        aria-describedby="post-char-count"
      />
      <div className="post-form__footer">
        <span id="post-char-count" className="post-form__count" aria-live="polite">{content.length}/500</span>
        <Button type="submit" disabled={!content.trim()}>Post</Button>
      </div>
    </form>
  );
}
