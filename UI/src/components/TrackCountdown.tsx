import { useEffect, useState } from "react";

interface TrackCountdownProps {
    startTime: number | null;
    serverDeltaMs: number;
}

export function TrackCountdown({ startTime, serverDeltaMs }: TrackCountdownProps) {
    const [remaining, setRemaining] = useState<number | null>(null);

    useEffect(() => {
        if (startTime === null) {
            setRemaining(null);
            return;
        }

        const update = () => {
            const diff = startTime - (Date.now() + serverDeltaMs);
            setRemaining(Math.max(0, diff));
        };

        update();
        const interval = setInterval(update, 50);

        return () => clearInterval(interval);
    }, [startTime, serverDeltaMs]);

    if (remaining === null || remaining === 0) return null;

    return (
        <div className="w-20 text-center text-sm">
            {(remaining / 1000).toFixed(1)} с
        </div>
    );
}