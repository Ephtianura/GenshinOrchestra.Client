import { useEffect, useRef } from "react";
import { signalRService } from "./signalrService";
import { send } from "../bridge/send";

export const useTrackReceiver = (isReady: boolean) => {
  const isReadyRef = useRef(isReady);

  useEffect(() => {
    isReadyRef.current = isReady;
  }, [isReady]);

  // Подписка на все ноты
  useEffect(() => {
    const handleReceiveNotes = (track: Record<string, unknown>) => {
      console.log("ReceiveNotes:", track);
      if (!isReadyRef.current) return;

      send.invoke("Start", { track: track }).catch(console.error);
    };

    signalRService.on("ReceiveNotes", handleReceiveNotes);

    return () => {
      signalRService.off("ReceiveNotes");
    };
  }, []);

  // Подписка на комнатные ноты
  useEffect(() => {
    const handleReceiveRoomNotes = (track: Record<string, unknown>) => {
      console.log("ReceiveRoomNotes:", track);
      if (!isReadyRef.current) return;

      send.invoke("Start", { track: track }).catch(console.error);
    };

    signalRService.on("ReceiveRoomNotes", handleReceiveRoomNotes);

    return () => {
      signalRService.off("ReceiveRoomNotes");
    };
  }, []);

  // Остановка
  useEffect(() => {
    if (isReady) return;

    send.invoke("Stop").catch(console.error);
  }, [isReady]);
};