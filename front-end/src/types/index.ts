export interface User {
  id: string;
  email?: string;
  displayName: string;
  zodiacSign: string;
  age?: number;
  bio?: string;
  hobbies: string[];
  favoriteFlower?: string;
  avatar: string | null;
  joinedAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  likes: string[];
  comments: Comment[];
}

export interface CompatibilityMatch {
  sign: string;
  percent: number;
  reason: string;
}

export interface CompatibilityData {
  high: CompatibilityMatch[];
  moderate: CompatibilityMatch[];
  challenging: CompatibilityMatch[];
}

export interface ZodiacEntry {
  id: string;
  zodiac: string;
  flower: string;
  image_url: string;
  description: string;
  icon: string;
  date_range: string;
  personality: { summary: string; traits: string[] };
  best_careers: string[];
  compatibility: { best_matches: string[]; challenging_matches: string[] };
  element: string;
  planet: string;
  color: string;
  comments?: Array<{
    id: string;
    user: string;
    message: string;
    timestamp: string;
    likes: number;
  }>;
  horoscope?: {
    daily?: Record<string, string>;
    weekly?: string;
    monthly?: string;
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ProfileFormData {
  displayName: string;
  zodiacSign: string;
  age?: number | string;
  bio?: string;
  hobbies?: string | string[];
  favoriteFlower?: string;
  avatar?: string | null;
}

export interface RegisterData extends ProfileFormData {
  email: string;
  password: string;
}

export type ThemeMode = "light" | "dark" | "system";
export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
