import type { RoomResponse } from "../types/types"; 
import { HiUsers } from "react-icons/hi2";

interface RoomCardProps {
    room: RoomResponse;
    onClick?: () => void;
}

export const RoomCard = ({ room, onClick }: RoomCardProps) => {
    let statusText = 'Активна';
    let statusTextColor = 'text-emerald-400';
    let cardClasses = "flex items-center justify-between p-3 rounded-lg border border-[#d3bc8e]/10 bg-[#17202e]/50 opacity-90 transition-all hover:opacity-100 hover:border-[#d3bc8e]/30 cursor-pointer";

    if (!room.isActive) {
        statusText = 'Закрыта';
        statusTextColor = 'text-gray-500';
        cardClasses = "flex items-center justify-between p-3 rounded-lg border border-gray-700/30 bg-[#12161f]/50 opacity-50 transition-all";
    }

    return (
        <div className={cardClasses} onClick={room.isActive ? onClick : undefined}>
            {/* Левая часть: Название комнаты и статус */}
            <div className="flex items-center gap-3 min-w-0">

                <div className="flex flex-col min-w-0 leading-tight">
                    <span className="text-xs font-semibold text-[#ece5d8] truncate">
                        {room.name}
                    </span>
                    <span className={`text-[11px] truncate ${statusTextColor}`}>
                        {statusText}
                    </span>
                </div>
            </div>

            {/* Правая часть: Счетчик игроков */}
            <div className="flex items-center gap-1.5 text-xs text-[#a4b3c6] shrink-0 ml-3 bg-[#121925]/60 px-2 py-1 rounded border border-[#d3bc8e]/10">
                <HiUsers className="w-4 h-4 text-[#d3bc8e]/70" />
                <span>{room.playersCount} / {room.maxPlayers}</span>
            </div>
        </div>
    );
};