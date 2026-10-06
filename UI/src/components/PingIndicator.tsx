import { HiChartBar } from 'react-icons/hi'

export function PingIndicator() {
    const ping = 34
    const displayPing = Math.min(ping, 999)

    const pingColor =
        ping <= 100
            ? 'var(--good-ping)'
            : ping <= 200
                ? 'var(--medium-ping)'
                : 'var(--bad-ping)'

    return (
        <div
            className="flex gap-2 items-center py-0.5 px-2 bg-[#ffffff0c]
        ring-2 ring-[#ffffff2e] rounded-full text-xs"
            style={{ color: pingColor }}
        >
            <HiChartBar />
            <span>{displayPing} мс.</span>
        </div>
    )
}
