import { useEffect, useRef, useState } from "react";
import { signalRService } from "./signalrService";
import { send } from "../bridge/send";

export const useTrackReceiver = (
  isReady: boolean,
  currentRoomId: string | null,
  serverDeltaMsRef: React.RefObject<number>,
) => {
  const [startTime, setStartTime] = useState<number | null>(null);

  const isReadyRef = useRef(isReady);
  isReadyRef.current = isReady;

  const currentRoomIdRef = useRef(currentRoomId);
  currentRoomIdRef.current = currentRoomId;

  // Глобальные ноты
  useEffect(() => {
    const handleReceiveNotes = (
      track: Record<string, unknown>,
      roomId: string | null,
    ) => {
      if (roomId !== null && roomId !== currentRoomIdRef.current) return;
      if (!isReadyRef.current) return;

      const time = track.startTimeUtcMs as number;

      setStartTime(time);

      send
        .invoke("Start", { track, serverDeltaMs: serverDeltaMsRef.current })
        .catch(console.error);
    };

    const handleStopNotes = (roomId: string | null) => {
      if (roomId !== null && roomId !== currentRoomIdRef.current) return;

      setStartTime(null);
      send.invoke("Stop").catch(console.error);
    };

    signalRService.on("ReceiveNotes", handleReceiveNotes);
    signalRService.on("StopNotes", handleStopNotes);

    return () => {
      signalRService.off("ReceiveNotes", handleReceiveNotes);
      signalRService.off("StopNotes", handleStopNotes);
    };
  }, []);

  // Остановка при потере готовности
  useEffect(() => {
    if (isReady) return;

    setStartTime(null);
    send.invoke("Stop").catch(console.error);
  }, [isReady]);

  return startTime;
};
