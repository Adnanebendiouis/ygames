// csrf.ts
export const getCookie = (name: string): string | null => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
  const value = cookieValue ? decodeURIComponent(cookieValue) : null;
  console.log(`[CSRF] getCookie("${name}") →`, value ?? "null (not found in document.cookie)");
  console.log("[CSRF] full document.cookie →", document.cookie);
  return value;
};

export const invalidateCSRFToken = () => {
  // kept for call-sites (login) — no-op now since we don't cache
  console.log("[CSRF] invalidateCSRFToken called (no-op, no cache)");
};

export const refreshCSRFToken = async (): Promise<string | null> => {
  return fetchFreshToken();
};

const fetchFreshToken = async (): Promise<string | null> => {
  console.log("[CSRF] fetching fresh token from /api/csrf/");
  try {
    const res = await fetch("https://api.ygames.shop/api/csrf/", {
      credentials: "include",
    });
    const data = await res.json();
    const token = data.csrfToken || null;
    console.log("[CSRF] /api/csrf/ returned token:", token);
    return token;
  } catch (err) {
    console.error("[CSRF] /api/csrf/ fetch failed:", err);
    return null;
  }
};

export const fetchWithCSRF = async (url: string, options: RequestInit = {}) => {
  // Always fetch from server — guarantees token matches Django's session cookie
  const csrfToken = await fetchFreshToken();
  console.log(`[CSRF] fetchWithCSRF → url: ${url} | token: ${csrfToken}`);
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken || "",
      ...(options.headers || {}),
    },
  });
};
