import axios from "axios";
import type { AuthResponse, Post, RegisterData, User, ZodiacEntry } from "../types";
import { clearToken, getToken } from "./storage";

const baseUrl = import.meta.env.VITE_API_URL;

const api = axios.create({ baseURL: baseUrl });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) clearToken();
    return Promise.reject(err);
  },
);

export async function fetchAllZodiacs(): Promise<ZodiacEntry[]> {
  const { data } = await api.get<ZodiacEntry[]>("/photos");
  return data;
}

export async function fetchZodiacById(id: string): Promise<ZodiacEntry> {
  const { data } = await api.get<ZodiacEntry>(`/photos/${id}`);
  return data;
}

export function getFlowerImageUrl(imageUrl: string): string {
  return `${baseUrl}/images/${imageUrl}`;
}

export function getAvatarUrl(avatar: string | null): string | null {
  if (!avatar) return null;
  if (avatar.startsWith("http") || avatar.startsWith("blob:")) return avatar;
  return `${baseUrl}${avatar}`;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const hobbies = typeof data.hobbies === "string"
    ? data.hobbies.split(",").map((h) => h.trim()).filter(Boolean)
    : data.hobbies || [];

  const { data: res } = await api.post<AuthResponse>("/auth/register", {
    email: data.email,
    password: data.password,
    displayName: data.displayName,
    zodiacSign: data.zodiacSign,
    age: data.age ? Number(data.age) : undefined,
    bio: data.bio,
    hobbies,
    favoriteFlower: data.favoriteFlower,
  });
  return res;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
  return data;
}

export async function fetchMe(): Promise<User> {
  const { data } = await api.get<User>("/auth/me");
  return data;
}

export async function updateProfile(data: Partial<User>): Promise<User> {
  const { data: res } = await api.put<User>("/users/me", {
    displayName: data.displayName,
    zodiacSign: data.zodiacSign,
    age: data.age,
    bio: data.bio,
    hobbies: data.hobbies,
    favoriteFlower: data.favoriteFlower,
    avatar: data.avatar,
  });
  return res;
}

export async function uploadAvatar(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("avatar", file);
  const { data } = await api.post<{ avatarUrl: string }>("/upload/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.avatarUrl;
}

export async function fetchUsers(): Promise<User[]> {
  const { data } = await api.get<User[]>("/users");
  return data;
}

export async function fetchPosts(): Promise<Post[]> {
  const { data } = await api.get<Post[]>("/posts");
  return data;
}

export async function createPost(content: string): Promise<Post> {
  const { data } = await api.post<Post>("/posts", { content });
  return data;
}

export async function togglePostLike(postId: string): Promise<Post> {
  const { data } = await api.post<Post>(`/posts/${postId}/like`);
  return data;
}

export async function addPostComment(postId: string, content: string): Promise<Post> {
  const { data } = await api.post<Post>(`/posts/${postId}/comments`, { content });
  return data;
}

export async function toggleFollow(userId: string): Promise<{ following: boolean }> {
  const { data } = await api.post<{ following: boolean }>(`/users/${userId}/follow`);
  return data;
}

export async function connectUser(userId: string): Promise<{ connected: boolean }> {
  const { data } = await api.post<{ connected: boolean }>(`/users/${userId}/connect`);
  return data;
}

export async function fetchFollowing(): Promise<string[]> {
  const { data } = await api.get<string[]>("/users/me/following");
  return data;
}

export async function fetchFriends(): Promise<string[]> {
  const { data } = await api.get<string[]>("/users/me/friends");
  return data;
}
