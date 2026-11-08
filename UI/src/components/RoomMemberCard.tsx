import { MemberStatus, type RoomMemberResponse } from '../types/types';
import { useAuth } from './AuthContext';

interface RoomMemberCardProps {
    member: RoomMemberResponse;
}

export const RoomMemberCard = ({ member }: RoomMemberCardProps) => {
    const initial = member.name.charAt(0).toUpperCase();
    const { user: me } = useAuth();

    const isMe = me?.id === member.userId;

    let statusText = 'Не готов';
    let statusTextColor = 'text-amber-400';
    let statusDotColor = 'bg-amber-400';

    let cardClasses = "flex items-center gap-3 h-17.5  rounded-lg border border-[#d3bc8e]/10 bg-[#17202e]/50 p-3 opacity-80 transition-all hover:opacity-100 hover:border-[#d3bc8e]/30";

    if (member.status === MemberStatus.Ready) {
        statusText = 'Готов';
        statusTextColor = 'text-emerald-400';
        statusDotColor = 'bg-emerald-400';
    } else if (member.status === MemberStatus.Offline) {
        statusText = 'Не в сети';
        statusTextColor = 'text-gray-500';
        statusDotColor = 'bg-gray-500';
        cardClasses = "flex items-center gap-3 rounded-lg border border-gray-700/30 bg-[#12161f]/50 p-3 opacity-50 transition-all";
    }

    // текущий пользователь
    if (isMe && member.status !== MemberStatus.Offline) {
        cardClasses = "flex items-center gap-3 rounded-lg border border-[#d3bc8e]/30 bg-linear-to-r from-[#212b3d] to-[#1a2232] p-3 shadow-md transition-all hover:border-[#d3bc8e]";
    }

    return (
        <div className={`${cardClasses} min-w-16`}>
            {/* Аватар */}
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d3bc8e]/50 bg-[#2c374d]">
                {member.avatarUrl ? (
                    <img src={member.avatarUrl} />
                ) : (
                    <span className="text-sm text-[#e0b974]">{initial}</span>
                )}

                {/* Статус */}
                <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#121925] ${statusDotColor}`} />
            </div>
            <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                    <span className="hidden md:block text-xs text-[#ece5d8] truncate">{member.name}</span>
                    <span className="hidden lg:block border-l pl-2 text-[11px] text-[#a4b3c6] truncate">{member.inGameNick}</span>
                </div>
                <span className={`hidden lg:block text-[11px] truncate ${statusTextColor}`}>{statusText}</span>
            </div>
        </div>
    );
};