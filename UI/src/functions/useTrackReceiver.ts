import { useEffect, useRef } from "react";
import { signalRService } from "./signalrService";
import { send } from "../bridge/send";
import { usePing } from "./usePing";

export const useTrackReceiver = (
  isReady: boolean,
  currentRoomId: string | null,
) => {
  const isReadyRef = useRef(isReady);
  const currentRoomIdRef = useRef(currentRoomId);

  isReadyRef.current = isReady;

  const {serverDeltaMs} = usePing();
  const serverDeltaMsRef = useRef(serverDeltaMs);

  useEffect(() => {
    serverDeltaMsRef.current = serverDeltaMs;
  }, [serverDeltaMs]);

  // Глобальные ноты
  useEffect(() => {
    const handleReceiveNotes = (track: Record<string, unknown>) => {
      console.log("ReceiveNotes:", track);
      if (!isReadyRef.current) return;

      console.warn(serverDeltaMsRef.current);
        send.invoke("Start", { track, serverDeltaMs: serverDeltaMsRef.current }).catch(console.error);
    };

    const handleStop = () => {
      send.invoke("Stop").catch(console.error);
    };

    signalRService.on("ReceiveNotes", handleReceiveNotes);
    signalRService.on("Stop", handleStop);

    return () => {
      signalRService.off("ReceiveNotes", handleReceiveNotes);
      signalRService.off("Stop", handleStop);
    };
  }, []);

  // Комнатные ноты
  useEffect(() => {
    const handleReceiveRoomNotes = (
      track: Record<string, unknown>,
      roomId: string,
    ) => {
      if (roomId !== currentRoomIdRef.current) return;
      if (!isReadyRef.current) return;

      send.invoke("Start", { track, serverDeltaMs: serverDeltaMsRef.current }).catch(console.error);
    };

    const handleStopRoom = (roomId: string) => {
      if (roomId !== currentRoomIdRef.current) return;

      send.invoke("Stop").catch(console.error);
    };

    signalRService.on("ReceiveRoomNotes", handleReceiveRoomNotes);
    signalRService.on("StopRoom", handleStopRoom);

    return () => {
      signalRService.off("ReceiveRoomNotes", handleReceiveRoomNotes);
      signalRService.off("StopRoom", handleStopRoom);
    };
  }, []);

  // Остановка при потере готовности
  useEffect(() => {
    if (isReady) return;

    send.invoke("Stop").catch(console.error);
  }, [isReady]);
};
