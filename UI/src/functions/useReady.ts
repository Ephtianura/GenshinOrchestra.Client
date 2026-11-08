import { useCallback, useEffect, useState } from "react";
import { signalRService } from "./signalrService";
import { MemberStatus } from "../types/types";
import { checkStatus } from "./checkStatus";
import { apiFetch } from "./api";

export function useReady(roomId: string | null, currentUserId: string) {
  const [statuses, setStatuses] = useState<Record<string, MemberStatus>>({});
  const [isLoading, setIsLoading] = useState(false);

  const status = roomId
    ? (statuses[roomId] ?? MemberStatus.NotReady)
    : MemberStatus.NotReady;

  // Загружаем начальный статус при смене комнаты
  useEffect(() => {
    if (!roomId) return;

    let cancelled = false;

    setIsLoading(true);

    checkStatus(roomId)
      .then((initialStatus) => {
        if (cancelled) return;

        setStatuses((prev) => ({
          ...prev,
          [roomId]: initialStatus,
        }));
      })
      .catch((error) => {
        console.error("Не удалось получить статус:", error);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [roomId]);

  // Слушаем изменения статуса во всех комнатах
  useEffect(() => {
    const handleUserStatus = (
      userId: string,
      newStatus: MemberStatus,
      eventRoomId: string,
    ) => {
      if (userId !== currentUserId) return;

      setStatuses((prev) => ({
        ...prev,
        [eventRoomId]: newStatus,
      }));
    };

    signalRService.on("UserStatus", handleUserStatus);

    return () => {
      signalRService.off("UserStatus");
    };
  }, [currentUserId]);

  const toggleReady = useCallback(async () => {
    if (!roomId || isLoading) return;

    const nextStatus =
      status === MemberStatus.Ready
        ? MemberStatus.NotReady
        : MemberStatus.Ready;

    setIsLoading(true);

    try {
      await apiFetch(`client/rooms/${roomId}/status`, {
        method: "POST",
        body: JSON.stringify(nextStatus),
      });

      setStatuses((prev) => ({
        ...prev,
        [roomId]: nextStatus,
      }));
    } catch (error) {
      console.error("Не удалось изменить статус:", error);
    } finally {
      setIsLoading(false);
    }
  }, [roomId, status, isLoading]);

  return {
    status,
    isReady: status === MemberStatus.Ready,
    isLoading,
    toggleReady,
  };
}