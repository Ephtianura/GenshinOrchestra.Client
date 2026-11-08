import { apiFetch } from "./api";

export async function login(data: { login: string; password: string; hwid: string }) {
  console.log(data)
  return await apiFetch("client/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
