import { useCallback, useEffect, useRef, useState } from "react";
import { apiFetch } from "./api";
import { signalRService } from "./signalrService";
import {
  MemberStatus,
  type RoomMemberResponse,
  type UserUpdateInfoEvent,
} from "../types/types";

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
    const handleUserUpdated = (data: UserUpdateInfoEvent) => {
      changeVersion.current++;

      setUsers((prev) =>
        prev.map((user) => {
          if (user.userId !== data.userId) return user;

          return {
            ...user,
            ...(data.nameChanged &&
              data.name !== null && {
                name: data.name,
              }),
            ...(data.enkaProfileChanged && {
              inGameNick: data.nickname,
              avatarUrl: data.iconUrl,
            }),
          };
        }),
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

    const handleUserOnline = (userId: string, status: MemberStatus) => {
      changeVersion.current++;

      setUsers((prev) =>
        prev.map((user) =>
          user.userId === userId ? { ...user, status } : user,
        ),
      );
    };
    const handleUserOffline = (userId: string) => {
      changeVersion.current++;

      setUsers((prev) =>
        prev.map((user) =>
          user.userId === userId
            ? { ...user, status: MemberStatus.Offline }
            : user,
        ),
      );
    };
    signalRService.on("UserStatus", handleUserStatus);
    signalRService.on("UserUpdated", handleUserUpdated);
    signalRService.on("UserJoined", handleUserJoined);
    signalRService.on("UserLeave", handleUserLeave);
    signalRService.on("UserOnline", handleUserOnline);
    signalRService.on("UserOffline", handleUserOffline);
    loadUsers();

    return () => {
      signalRService.off("UserStatus", handleUserStatus);
      signalRService.off("UserUpdated", handleUserUpdated);
      signalRService.off("UserJoined", handleUserJoined);
      signalRService.off("UserLeave", handleUserLeave);
      signalRService.off("UserOnline", handleUserOnline);
      signalRService.off("UserOffline", handleUserOffline);
    };
  }, [roomId, loadUsers]);

  return {
    users,
    isLoading,
    reload: loadUsers,
  };
}
