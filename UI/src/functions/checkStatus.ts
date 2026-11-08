import type { MemberStatus } from "../types/types";
import { apiFetch } from "./api";

export async function checkStatus(roomId: string) {
    return apiFetch<MemberStatus>(`client/rooms/${roomId}/status`);
}
