import { apiFetch } from "./api";

export async function register(data: {
  name: string;
  login: string;
  password: string;
  hwid: string;
}) {
  return await apiFetch("client/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
