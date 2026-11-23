import type { ClientStatusResponse } from "../types/types";
import { apiFetch } from "./api";

export async function checkStatus(roomId: string) {
    return apiFetch<ClientStatusResponse>(`client/rooms/${roomId}/status`);
}
