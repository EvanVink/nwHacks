import { API_BASE } from "../utils/constants";
import type { User } from "../types";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    const message = (payload as { error?: string }).error || "Request failed";
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await handleResponse<{ user: User }>(res);
  return data.user;
}

export async function login(email: string, password: string): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse<{ user: User }>(res);
  return data.user;
}

export async function startSession(
  userId: string,
): Promise<{ sessionId: string; startedAt: string }> {
  const res = await fetch(`${API_BASE}/sessions/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  return handleResponse(res);
}

export async function endSession(
  sessionId: string,
): Promise<{ sessionId: string; endedAt: string }> {
  const res = await fetch(`${API_BASE}/sessions/${sessionId}/end`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return handleResponse(res);
}
