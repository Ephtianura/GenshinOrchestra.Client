import { useCallback, useEffect, useRef, useState } from "react";
import { apiFetch } from "./api";
import { signalRService } from "./signalrService";
import { MemberStatus, type RoomMemberResponse } from "../types/types";

export function usePlayers(roomId: string | null) {
  const [users, setUsers] = useState<RoomMemberResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const requestId = useRef(0);
  const changeVersion = useRef(0);

  const loadUsers = useCallback(async () => {
    if (!roomId) {
      setUsers([]);
      setIsLoading(false);
      return;
    }

    const currentRequest = ++requestId.current;
    const currentVersion = changeVersion.current;

    setIsLoading(true);

    try {
      const data = await apiFetch<RoomMemberResponse[]>(
        `client/rooms/${roomId}/participants`,
      );

      // Не применяем устаревший ответ от предыдущего запроса.
      if (
        currentRequest === requestId.current &&
        currentVersion === changeVersion.current
      ) {
        setUsers(data ?? []);
      }
    } catch (error) {
      console.error("Не удалось загрузить участников:", error);
    } finally {
      if (currentRequest === requestId.current) {
        setIsLoading(false);
      }
    }
  }, [roomId]);

  useEffect(() => {
    if (!roomId) {
      setUsers([]);
      setIsLoading(false);
      return;
    }

    const handleUserStatus = (userId: string, status: MemberStatus) => {
      changeVersion.current++;

      setUsers((prev) =>
        prev.map((user) =>
          user.userId === userId ? { ...user, status } : user,
        ),
      );
    };

    const handleUserJoined = (
      member: RoomMemberResponse,
      eventRoomId: string,
    ) => {
      if (eventRoomId !== roomId) return;

      changeVersion.current++;

      setUsers((prev) => {
        if (prev.some((user) => user.userId === member.userId)) return prev;

        return [...prev, member];
      });
    };

    const handleUserLeave = (userId: string, eventRoomId: string) => {
      if (eventRoomId !== roomId) return;

      changeVersion.current++;

      setUsers((prev) => prev.filter((user) => user.userId !== userId));
    };

    signalRService.on("UserJoined", handleUserJoined);
    signalRService.on("UserLeave", handleUserLeave);
    signalRService.on("UserStatus", handleUserStatus);

    loadUsers();

    return () => {
      signalRService.off("UserJoined", handleUserJoined);
      signalRService.off("UserLeave", handleUserLeave);
      signalRService.off("UserStatus", handleUserStatus);
    };
  }, [roomId, loadUsers]);

  return {
    users,
    isLoading,
    reload: loadUsers,
  };
}
