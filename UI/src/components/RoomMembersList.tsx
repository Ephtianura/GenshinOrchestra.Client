import { usePlayers } from '../functions/usePlayers';
import { MainCard } from './MainCard';
import { RoomMemberCard } from './RoomMemberCard';

interface RoomMembersListProps {
    roomId: string | null;
}

export const RoomMembersList = ({ roomId }: RoomMembersListProps) => {
    const { users } = usePlayers(roomId);
  
    return (
        <MainCard name={'Участники'} className='overflow-y-auto overflow-x-hidden' >
            {roomId && users.length > 0 ? (
                <div className="flex flex-col gap-3">
                    {users.map((member) => (
                        <RoomMemberCard key={member.userId} member={member} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center text-gray-500 dark:text-gray-400 text-xs">
                    <span>Никого пока нет...</span>
                </div>
            )}
        </MainCard>
    );
};