import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useToast } from "../../context/ToastContext";
import ProfileForm from "../../components/profile/ProfileForm/ProfileForm";
import type { ProfileFormData } from "../../types";
import "./Profile.scss";

export default function ProfileEdit() {
  const { profile, updateProfile, uploadAvatar } = useUser();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!profile) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (data: ProfileFormData & { avatarFile?: File }) => {
    setLoading(true);
    try {
      if (data.avatarFile) {
        await uploadAvatar(data.avatarFile);
      }
      await updateProfile({
        displayName: data.displayName,
        zodiacSign: data.zodiacSign,
        age: data.age ? Number(data.age) : undefined,
        bio: data.bio,
        hobbies: Array.isArray(data.hobbies) ? data.hobbies : [],
        favoriteFlower: data.favoriteFlower,
      });
      addToast("Profile updated!", "success");
      navigate("/profile");
    } catch {
      addToast("Failed to update profile.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page page-section">
      <div className="container profile-page__inner">
        <h1 className="section-title">Edit Profile</h1>
        <p className="section-subtitle">Update your cosmic identity.</p>
        <div className="profile-page__card">
          <ProfileForm initialData={profile} onSubmit={handleSubmit} submitLabel="Save Changes" loading={loading} />
        </div>
      </div>
    </div>
  );
}
