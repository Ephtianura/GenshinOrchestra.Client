import { useEffect, useState } from 'react';
import { HiChartBar } from 'react-icons/hi';
import { usePing } from '../functions/usePing';
import { useSignalRState } from '../functions/useSignalRState';
import { CircleSpinner } from './CircleSpinner';

export function PingIndicator() {
    const { displayPing, serverDeltaMs } = usePing();

    const { isConnectionLost } = useSignalRState();
    const [isLongConnectionLost, setIsLongConnectionLost] = useState(false);

    useEffect(() => {
        if (!isConnectionLost) {
            setIsLongConnectionLost(false);
            return;
        }

        const timeout = setTimeout(() => {
            setIsLongConnectionLost(true);
        }, 3000);

        return () => clearTimeout(timeout);
    }, [isConnectionLost]);

    const pingColor = isLongConnectionLost
        ? 'var(--bad-ping)'
        : displayPing <= 100
            ? 'var(--good-ping)'
            : displayPing <= 200
                ? 'var(--medium-ping)'
                : 'var(--bad-ping)';

    const deltaTooltip =
        serverDeltaMs > 0
            ? `Часы отстают на ${Math.round(serverDeltaMs)} мс.`
            : serverDeltaMs < 0
                ? `Часы спешат на ${Math.abs(Math.round(serverDeltaMs))} мс.`
                : 'Часы синхронизированы';

    return (
        <div title={deltaTooltip} className={`grid grid-cols-[auto_1fr] items-center w-22 
            gap-1 py-0.5 px-2 bg-[#55555510] ring-2 ring-[#f0f0f029] rounded-full text-xs`}
            style={{ color: pingColor }}
        >
            {isConnectionLost ? (
                <CircleSpinner size={18} strokeWidth={5} color={pingColor} speed='2s' />
            ) : (
                <HiChartBar className="justify-self-start h-4 w-4" />
            )}
            <p className="text-center mt-px">{displayPing} мс.</p>
        </div>
    )
}