import { useState, useEffect, useRef } from "react";
import { signalRService } from "./signalrService";

interface PingResponse {
  serverTimeUtcMs: number;
}

// Делает запрос к hub/Ping каждые 3 секунды,
// считает время запроса, сглаживает и округляет значение до целого в промежутке 0-999.
// а также считает разницу во времени между сервером и клиентом
export function usePing() {
  const [displayPing, setDisplayPing] = useState(0);
  const [serverDeltaMs, setServerDeltaMs] = useState(0);

  const previousPingRef = useRef(0);

  useEffect(() => {
    let intervalId: number | null = null;
    let isMounted = true;

    const sendRandomRequest = () => {
      if (signalRService.isConnectionLost || !isMounted) return;

      const startTime = performance.now();

      signalRService
        .invoke<PingResponse>("Ping")
        .then((res) => {
          if (!isMounted) return;

          const rawPing = Math.round(performance.now() - startTime);
          const clampedPing = Math.max(0, Math.min(rawPing, 999));

          const smoothed =
            previousPingRef.current === 0
              ? clampedPing
              : Math.round(clampedPing * 0.4 + previousPingRef.current * 0.6);

          previousPingRef.current = smoothed;
          setDisplayPing(smoothed);

          const oneWayDelay = smoothed / 2;
          const estimatedServerTime = res.serverTimeUtcMs + oneWayDelay;

          const rawDelta = estimatedServerTime - Date.now();
          const roundedDelta = Math.round(rawDelta); 

          setServerDeltaMs(roundedDelta);
        })
        .catch((err) => {
          if (isMounted) {
            console.error("Ping Invoke Error: ", err);
          }
        });
    };

    signalRService.start().then(() => {
      if (!isMounted) return;

      sendRandomRequest();
      intervalId = window.setInterval(sendRandomRequest, 3000);
    });

    return () => {
      isMounted = false;
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return {
    displayPing,
    serverDeltaMs,
  };
}
