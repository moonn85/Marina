export const API_BASE = "http://localhost:8080/api/v1";

let accessToken: string | null = null;
export const setAccessToken = (t: string | null) => (accessToken = t);
export const getAccessToken = () => accessToken;

let refreshing = false;
let waiters: Array<(ok: boolean) => void> = [];

async function refreshAccessToken(): Promise<boolean> {
  if (refreshing) return new Promise(r => waiters.push(r));
  refreshing = true;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) { setAccessToken(null); waiters.forEach(w=>w(false)); waiters=[]; return false; }
    const json = await res.json(); // { accessToken: string }
    setAccessToken(json.accessToken);
    waiters.forEach(w=>w(true)); waiters=[];
    return true;
  } catch {
    setAccessToken(null); waiters.forEach(w=>w(false)); waiters=[]; return false;
  } finally { refreshing = false; }
}

export async function authorizedFetch<T = any>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const headers: Record<string,string> = { "Content-Type":"application/json", ...(init.headers as any) };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let res = await fetch(`${API_BASE}${path}`, { ...init, headers, credentials: "include" });
  if (res.status === 401) {
    const ok = await refreshAccessToken();
    if (!ok) throw new Error("Unauthorized");
    const headers2: Record<string,string> = { "Content-Type":"application/json", ...(init.headers as any) };
    if (accessToken) headers2.Authorization = `Bearer ${accessToken}`;
    res = await fetch(`${API_BASE}${path}`, { ...init, headers: headers2, credentials: "include" });
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  return text ? JSON.parse(text) as T : (null as T);
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  const json = await res.json(); // { accessToken, user? }
  setAccessToken(json.accessToken);
  return json;
}

export async function logout() {
  try {
    await fetch(`${API_BASE}/auth/logout`, { method: "POST", credentials: "include" });
  } finally {
    setAccessToken(null);
  }
}

export async function bootstrapAuth() {
  try { await refreshAccessToken(); } catch {}
}
