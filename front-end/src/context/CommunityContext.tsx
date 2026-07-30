import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import * as api from "../services/api";
import type { Post, User } from "../types";
import { useUser } from "./UserContext";

interface CommunityContextValue {
  posts: Post[];
  users: User[];
  follows: string[];
  friends: string[];
  loading: boolean;
  createPost: (content: string) => Promise<Post | undefined>;
  toggleLike: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  toggleFollow: (userId: string) => Promise<void>;
  addFriend: (userId: string) => Promise<void>;
  getUserById: (id: string) => User | undefined;
  isFollowing: (id: string) => boolean;
  isFriend: (id: string) => boolean;
  refresh: () => Promise<void>;
}

const CommunityContext = createContext<CommunityContextValue | null>(null);

export function CommunityProvider({ children }: { children: ReactNode }) {
  const { profile, isLoggedIn } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [follows, setFollows] = useState<string[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [postsData, usersData] = await Promise.all([api.fetchPosts(), api.fetchUsers()]);
      setPosts(postsData);
      setUsers(usersData);
      if (isLoggedIn) {
        const [following, friendsList] = await Promise.all([api.fetchFollowing(), api.fetchFriends()]);
        setFollows(following);
        setFriends(friendsList);
      }
    } catch { /* API unavailable */ }
    finally { setLoading(false); }
  }, [isLoggedIn]);

  useEffect(() => { refresh(); }, [refresh]);

  const createPost = useCallback(async (content: string) => {
    if (!profile) return;
    const post = await api.createPost(content);
    setPosts((prev) => [post, ...prev]);
    return post;
  }, [profile]);

  const toggleLike = useCallback(async (postId: string) => {
    if (!profile) return;
    const updated = await api.togglePostLike(postId);
    setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
  }, [profile]);

  const addComment = useCallback(async (postId: string, content: string) => {
    if (!profile) return;
    const updated = await api.addPostComment(postId, content);
    setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
  }, [profile]);

  const toggleFollow = useCallback(async (userId: string) => {
    const { following } = await api.toggleFollow(userId);
    setFollows((prev) => following ? [...prev, userId] : prev.filter((id) => id !== userId));
  }, []);

  const addFriend = useCallback(async (userId: string) => {
    await api.connectUser(userId);
    setFriends((prev) => prev.includes(userId) ? prev : [...prev, userId]);
  }, []);

  const getUserById = useCallback((id: string) => {
    if (profile?.id === id) return profile;
    return users.find((u) => u.id === id);
  }, [profile, users]);

  const allUsers = profile ? [profile, ...users.filter((u) => u.id !== profile.id)] : users;

  return (
    <CommunityContext.Provider value={{
      posts, users: allUsers, follows, friends, loading,
      createPost, toggleLike, addComment, toggleFollow, addFriend,
      getUserById, isFollowing: (id) => follows.includes(id),
      isFriend: (id) => friends.includes(id), refresh,
    }}>
      {children}
    </CommunityContext.Provider>
  );
}

export function useCommunity(): CommunityContextValue {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error("useCommunity must be used within CommunityProvider");
  return ctx;
}
