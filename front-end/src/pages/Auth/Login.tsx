import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/ui/Button/Button";
import "./Auth.scss";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isLoggedIn } = useUser();
  const { addToast } = useToast();
  const navigate = useNavigate();

  if (isLoggedIn) {
    navigate("/profile");
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      addToast("Welcome back!", "success");
      navigate("/profile");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
        || "Login failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-section">
      <div className="container auth-page__inner">
        <h1 className="section-title">Welcome Back</h1>
        <p className="section-subtitle">Sign in to access your profile, community, and cosmic connections.</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate aria-labelledby="login-heading">
          <h2 id="login-heading" className="sr-only">Login form</h2>

          {error && (
            <div className="auth-form__error" role="alert" aria-live="assertive">
              {error}
            </div>
          )}

          <div className="auth-form__group">
            <label htmlFor="login-email" className="auth-form__label">Email</label>
            <input
              id="login-email"
              type="email"
              className="auth-form__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              aria-required="true"
              placeholder="you@example.com"
            />
          </div>

          <div className="auth-form__group">
            <label htmlFor="login-password" className="auth-form__label">Password</label>
            <input
              id="login-password"
              type="password"
              className="auth-form__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              aria-required="true"
              minLength={6}
              placeholder="Your password"
            />
          </div>

          <Button type="submit" size="lg" disabled={loading} aria-busy={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="auth-page__switch">
          New here? <Link to="/profile/create">Create an account</Link>
        </p>

        <p className="auth-page__demo" role="note">
          Demo accounts: luna@cosmos.test / cosmos123
        </p>
      </div>
    </div>
  );
}
