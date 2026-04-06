// csrf.ts
export const getCookie = (name: string): string | null => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
  return cookieValue ? decodeURIComponent(cookieValue) : null;
};

let cachedCSRFToken: string | null = null;
let csrfFetchPromise: Promise<string | null> | null = null;

export const refreshCSRFToken = async (): Promise<string | null> => {
  if (cachedCSRFToken) return cachedCSRFToken;

  // Deduplicate concurrent calls — only one request in-flight at a time
  if (!csrfFetchPromise) {
    csrfFetchPromise = fetch("https://api.ygames.shop/api/csrf/", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        cachedCSRFToken = data.csrfToken || null;
        csrfFetchPromise = null;
        return cachedCSRFToken;
      })
      .catch(() => {
        csrfFetchPromise = null;
        return null;
      });
  }

  return csrfFetchPromise;
};

export const invalidateCSRFToken = () => {
  cachedCSRFToken = null;
};

export const fetchWithCSRF = async (url: string, options: RequestInit = {}) => {
  const csrfToken = await refreshCSRFToken();
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
