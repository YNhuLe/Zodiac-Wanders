import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { ZODIAC_SIGNS } from "../../../data/compatibility";
import { getAvatarUrl } from "../../../services/api";
import type { ProfileFormData, User } from "../../../types";
import Avatar from "../../ui/Avatar/Avatar";
import Button from "../../ui/Button/Button";
import "./ProfileForm.scss";

interface ProfileFormProps {
  initialData?: Partial<User>;
  onSubmit: (data: ProfileFormData & { avatarFile?: File }) => void;
  submitLabel?: string;
  isRegister?: boolean;
  loading?: boolean;
}

export default function ProfileForm({
  initialData,
  onSubmit,
  submitLabel = "Save Profile",
  isRegister = false,
  loading = false,
}: ProfileFormProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialData?.avatar ? getAvatarUrl(initialData.avatar) : null,
  );
  const [avatarFile, setAvatarFile] = useState<File | undefined>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    email: "",
    password: "",
    displayName: initialData?.displayName || "",
    zodiacSign: initialData?.zodiacSign || "",
    age: initialData?.age?.toString() || "",
    bio: initialData?.bio || "",
    hobbies: initialData?.hobbies?.join(", ") || "",
    favoriteFlower: initialData?.favoriteFlower || "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, avatar: "Image must be under 5MB." }));
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, avatar: "" }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!form.displayName.trim()) newErrors.displayName = "Display name is required.";
    if (!form.zodiacSign) newErrors.zodiacSign = "Zodiac sign is required.";
    if (isRegister) {
      if (!form.email.trim()) newErrors.email = "Email is required.";
      if (!form.password || form.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      ...form,
      displayName: form.displayName.trim(),
      age: form.age ? Number(form.age) : undefined,
      hobbies: form.hobbies ? form.hobbies.split(",").map((h) => h.trim()).filter(Boolean) : [],
      avatarFile,
    });
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit} noValidate aria-label={isRegister ? "Registration form" : "Profile edit form"}>
      <div className="profile-form__avatar-section">
        <Avatar
          name={form.displayName || "?"}
          src={avatarPreview}
          size="xl"
        />
        <div>
          <label htmlFor="avatar-upload" className="profile-form__upload-btn">
            Upload Photo
          </label>
          <input
            id="avatar-upload"
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={handleAvatarChange}
            aria-describedby={errors.avatar ? "avatar-error" : "avatar-hint"}
          />
          <p id="avatar-hint" className="profile-form__hint">JPG, PNG, WebP or GIF. Max 5MB.</p>
          {errors.avatar && <p id="avatar-error" className="profile-form__field-error" role="alert">{errors.avatar}</p>}
        </div>
      </div>

      {isRegister && (
        <>
          <div className="profile-form__group">
            <label htmlFor="email" className="profile-form__label">Email <span aria-hidden="true">*</span></label>
            <input
              id="email"
              name="email"
              type="email"
              className="profile-form__input"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && <p id="email-error" className="profile-form__field-error" role="alert">{errors.email}</p>}
          </div>
          <div className="profile-form__group">
            <label htmlFor="password" className="profile-form__label">Password <span aria-hidden="true">*</span></label>
            <input
              id="password"
              name="password"
              type="password"
              className="profile-form__input"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              autoComplete="new-password"
              aria-required="true"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
            />
            {errors.password && <p id="password-error" className="profile-form__field-error" role="alert">{errors.password}</p>}
          </div>
        </>
      )}

      <div className="profile-form__group">
        <label htmlFor="displayName" className="profile-form__label">Display Name <span aria-hidden="true">*</span></label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          className="profile-form__input"
          value={form.displayName}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={!!errors.displayName}
          aria-describedby={errors.displayName ? "name-error" : undefined}
          placeholder="Your cosmic name"
        />
        {errors.displayName && <p id="name-error" className="profile-form__field-error" role="alert">{errors.displayName}</p>}
      </div>

      <div className="profile-form__group">
        <label htmlFor="zodiacSign" className="profile-form__label">Zodiac Sign <span aria-hidden="true">*</span></label>
        <select
          id="zodiacSign"
          name="zodiacSign"
          className="profile-form__input"
          value={form.zodiacSign}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={!!errors.zodiacSign}
        >
          <option value="">Select your sign</option>
          {ZODIAC_SIGNS.map((sign) => (
            <option key={sign} value={sign}>{sign}</option>
          ))}
        </select>
        {errors.zodiacSign && <p className="profile-form__field-error" role="alert">{errors.zodiacSign}</p>}
      </div>

      <div className="profile-form__row">
        <div className="profile-form__group">
          <label htmlFor="age" className="profile-form__label">Age</label>
          <input id="age" name="age" type="number" min="13" max="120" className="profile-form__input" value={form.age} onChange={handleChange} placeholder="Optional" />
        </div>
        <div className="profile-form__group">
          <label htmlFor="favoriteFlower" className="profile-form__label">Favorite Flower</label>
          <input id="favoriteFlower" name="favoriteFlower" type="text" className="profile-form__input" value={form.favoriteFlower} onChange={handleChange} placeholder="e.g. Rose" />
        </div>
      </div>

      <div className="profile-form__group">
        <label htmlFor="bio" className="profile-form__label">Bio</label>
        <textarea id="bio" name="bio" className="profile-form__input profile-form__textarea" value={form.bio} onChange={handleChange} rows={3} placeholder="Tell the community about yourself..." />
      </div>

      <div className="profile-form__group">
        <label htmlFor="hobbies" className="profile-form__label">Favorite Hobbies</label>
        <input id="hobbies" name="hobbies" type="text" className="profile-form__input" value={form.hobbies} onChange={handleChange} placeholder="Comma-separated, e.g. Reading, Yoga" />
      </div>

      <Button type="submit" size="lg" className="profile-form__submit" disabled={loading} aria-busy={loading}>
        {loading ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
