import { useEffect, useRef } from "react";
import { signalRService } from "./signalrService";
import { send } from "../bridge/send";

export const useTrackReceiver = (isReady: boolean) => {
  const isReadyRef = useRef(isReady);

  useEffect(() => {
    isReadyRef.current = isReady;
  }, [isReady]);

  // Получение трека
  useEffect(() => {
    const handleReceiveNotes = (track: Record<string, unknown>) => {
      console.log(track);
      if (!isReadyRef.current) return;

       send.invoke("Start", { track: track }).catch(console.error);
    };

    signalRService.on("ReceiveNotes", handleReceiveNotes);

    return () => {
      signalRService.off("ReceiveNotes");
    };
  }, []);

  // Остановка
  useEffect(() => {
    if (isReady) return;

    send.invoke("Stop").catch(console.error);
  }, [isReady]);
};
