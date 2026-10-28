import { HiChartBar } from 'react-icons/hi';
import { usePing } from '../functions/usePing';
import { useSignalRState } from '../functions/useSignalRState';
import { CircleSpinner } from './CircleSpinner';

export function PingIndicator() {
    const displayPing = usePing();
    const { isConnectionLost } = useSignalRState();

    const pingColor =
        displayPing <= 100
            ? 'var(--good-ping)'
            : displayPing <= 200
                ? 'var(--medium-ping)'
                : 'var(--bad-ping)'

    return (
        <div className="grid grid-cols-[auto_1fr] items-center w-22 gap-1 py-0.5 px-2 bg-[#55555510] ring-2 ring-[#f0f0f029] rounded-full text-xs"
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
