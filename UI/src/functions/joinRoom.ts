import type { RoomResponse } from "../types/types";
import { signalRService } from "./signalrService";

/**
 * Подключается к комнате по инвайт-коду и опциональному паролю через SignalR.
 *
 * @param inviteCode - Код приглашения в комнату
 * @param password - Опциональный пароль (если комната защищена)
 * @returns Промис с объектом RoomResponse от сервера
 */
export async function joinRoom(
  inviteCode: string,
  password?: string,
): Promise<RoomResponse> {
  try {
    await signalRService.start();

    const response = await signalRService.invoke<RoomResponse>("JoinRoom", {
      inviteCode,
      password: password ?? null,
    });
    return response;
  } catch (error) {
    console.error("JoinRoom Error: ", error);
    throw error;
  }
}
