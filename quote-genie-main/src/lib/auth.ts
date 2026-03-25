export interface AuthUser {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export function getUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}
