import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useToast } from "../../context/ToastContext";
import ProfileForm from "../../components/profile/ProfileForm/ProfileForm";
import type { ProfileFormData, RegisterData } from "../../types";
import "./Profile.scss";

export default function ProfileCreate() {
  const { register, uploadAvatar, isLoggedIn } = useUser();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (isLoggedIn) {
    navigate("/profile");
    return null;
  }

  const handleSubmit = async (data: ProfileFormData & { avatarFile?: File; email?: string; password?: string }) => {
    setLoading(true);
    try {
      await register(data as RegisterData);
      if (data.avatarFile) {
        await uploadAvatar(data.avatarFile);
      }
      addToast("Welcome to Zodiac Wanders!", "success");
      navigate("/profile");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
        || "Registration failed. Please try again.";
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page page-section">
      <div className="container profile-page__inner">
        <h1 className="section-title">Join the Cosmos</h1>
        <p className="section-subtitle">
          Create your account to unlock personalized compatibility, community features, and cosmic connections.
        </p>
        <div className="profile-page__card">
          <ProfileForm onSubmit={handleSubmit} submitLabel="Create Account" isRegister loading={loading} />
        </div>
        <p className="profile-page__auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
