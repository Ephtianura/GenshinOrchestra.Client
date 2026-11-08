import { parseApiErrors } from "./parseApiErrors";

const DEV = import.meta.env.DEV

const API_URL = DEV
    ? import.meta.env.VITE_API_DEV_URL!
    : import.meta.env.VITE_API_URL!;

type ApiFetchOptions = RequestInit & {
  cookieHeader?: string;
};

export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 5000);

  const headers = new Headers(options.headers || {});

  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "GenshinOrchestra.Client/1.0");
  }

  // Set cookies
  if (options.cookieHeader) {
    headers.set("Cookie", options.cookieHeader);
  }

  // 📦 JSON по умолчанию (кроме FormData)
  if (!(options.body instanceof FormData)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  if (DEV) {
    console.log(
      "➡️ API Request:",
      `${API_URL}${endpoint}`,
      "| Options:",
      options,
      // "| Cache: ",// options?.cache,// "| Headers:",// headers,// "| Credentials: include",
    );
  }

  let res: any = null;
  try {
    res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      cache: options?.cache,
      headers,
      credentials: "include",
    });
    clearTimeout(id);
  } catch (error) {
    if (DEV) {
      console.error("❌ API FETCH FAILED:", `${API_URL}${endpoint}`, error);
    }
    throw {
      status: 0,
      messages: ["Всё сломалось."],
    };
  }

  // Пробуем распарсить JSON
  let data: any = null;
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  // Важная отладка
  if (DEV) {
    console.log(
      "📤 API Response:",
      endpoint,
      "status:",
      res.status,
      "body:",
      data,
    );
  }

  // Парсинг ошибок
  if (!res.ok) {
    const messages = parseApiErrors(data);
    throw {
      status: res.status,
      messages,
    };
  }

  return data;
}
