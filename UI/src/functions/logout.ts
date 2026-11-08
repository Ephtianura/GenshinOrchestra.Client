import { apiFetch } from "./api";

export async function logout() {
  try {
    await apiFetch("client/auth/logout", { method: "POST" });
    window.location.href = "/";
  } catch {
  }
}
