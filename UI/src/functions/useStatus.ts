import { useCallback, useEffect, useState } from "react";
import { signalRService } from "./signalrService";
import { MemberStatus, type ClientStatusResponse } from "../types/types";
import { checkStatus } from "./checkStatus";
import { apiFetch } from "./api";

export function useStatus(roomId: string | null, currentUserId: string) {
  const [statuses, setStatuses] = useState<
    Record<string, ClientStatusResponse>
  >({});
  const [isLoading, setIsLoading] = useState(false);

  const clientStatus = roomId ? statuses[roomId] : undefined;
  const status = clientStatus?.status ?? MemberStatus.NotReady;
  const instrument = clientStatus?.instrument ?? null;

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
        [eventRoomId]: {
          ...prev[eventRoomId],
          status: newStatus,
        },
      }));
    };

    signalRService.on("UserStatus", handleUserStatus);

    return () => {
      signalRService.off("UserStatus", handleUserStatus);
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
        method: "PATCH",
        body: JSON.stringify(nextStatus),
      });

      setStatuses((prev) => ({
        ...prev,
        [roomId]: {
          ...prev[roomId],
          status: nextStatus,
        },
      }));
    } catch (error) {
      console.error("Не удалось изменить статус:", error);
    } finally {
      setIsLoading(false);
    }
  }, [roomId, status, isLoading]);

  return {
    status,
    instrument,
    isReady: status === MemberStatus.Ready,
    isLoading,
    toggleReady,
  };
}
