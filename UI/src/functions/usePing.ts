import { useState, useEffect } from "react";
import { signalRService } from "./signalrService";

// Делает запрос к hub/Ping каждые 3 секунды, 
// считает время запроса, сглаживает и округляет значение до целого в промежутке 0-999.
export function usePing() {
    const [displayPing, setDisplayPing] = useState<number>(0);

    useEffect(() => {
        let intervalId: number | null = null;
        let isMounted = true;

        const sendRandomRequest = () => {
            if (signalRService.isConnectionLost || !isMounted) return;

            const startTime = performance.now();

            signalRService
                .invoke("Ping")
                .then(() => {
                    if (!isMounted) return;

                    const rawPing = Math.round(performance.now() - startTime);
                    const clampedPing = Math.max(0, Math.min(rawPing, 999));

                    setDisplayPing((prevDisplay) => {
                        if (prevDisplay === 0) return clampedPing;

                        // Сглаживание: 40% нового значения, 60% старого значения.
                        const smoothed = Math.round(clampedPing * 0.4 + prevDisplay * 0.6);
                        return Math.max(0, Math.min(smoothed, 999));
                    });
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

    return displayPing;
}