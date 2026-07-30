import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import * as api from "../services/api";
import { clearToken, getToken, saveToken } from "../services/storage";
import type { RegisterData, User } from "../types";

interface UserContextValue {
  profile: User | null;
  loaded: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) { setLoaded(true); return; }
    api.fetchMe().then(setProfile).catch(() => clearToken()).finally(() => setLoaded(true));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user, token } = await api.login(email, password);
    saveToken(token);
    setProfile(user);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const { user, token } = await api.register(data);
    saveToken(token);
    setProfile(user);
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    const updated = await api.updateProfile(data);
    setProfile(updated);
  }, []);

  const uploadAvatar = useCallback(async (file: File) => {
    const avatarUrl = await api.uploadAvatar(file);
    const updated = await api.updateProfile({ avatar: avatarUrl });
    setProfile(updated);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setProfile(null);
  }, []);

  return (
    <UserContext.Provider value={{ profile, loaded, isLoggedIn: !!profile, login, register, updateProfile, uploadAvatar, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
