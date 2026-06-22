const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

type ApiOptions = RequestInit & {
  auth?: boolean;
};

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth !== false) {
    const token = localStorage.getItem("access_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = data?.detail || data?.message || "Request failed. Please try again.";
    throw new Error(Array.isArray(message) ? message[0]?.msg || "Request failed." : message);
  }

  return data as T;
}

export type Doubt = {
  id: string;
  subject: string;
  topic: string;
  question: string;
  ai_answer?: string | null;
  status: "open" | "answered" | "resolved";
  created_at: string;
  updated_at: string;
};
