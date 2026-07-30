const TOKEN_KEY = "zw_token";
const THEME_KEY = "zw_theme";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getStoredTheme(): string | null {
  return localStorage.getItem(THEME_KEY);
}

export function saveTheme(theme: string): void {
  localStorage.setItem(THEME_KEY, theme);
}
