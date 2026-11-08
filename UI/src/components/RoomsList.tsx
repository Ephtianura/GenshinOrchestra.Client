import { FiPlus } from 'react-icons/fi';
import { MainCard } from './MainCard';
import { RoomCard } from './RoomCard';
import { useEffect, useRef, useState } from 'react';
import { RoomJoinModal } from './RoomJoinModal';
import { useRooms } from '../functions/useRooms';

interface RoomsListProps {
    onRoomClick: (roomId: string) => void;
}

export const RoomsList = ({ onRoomClick }: RoomsListProps) => {
    const [showModal, setShowModal] = useState(false);
    const { rooms, isLoading, reload } = useRooms();

    const initialRoomSelected = useRef(false);
    useEffect(() => {
        if (
            !isLoading &&
            rooms.length > 0 &&
            !initialRoomSelected.current
        ) {
            initialRoomSelected.current = true;
            onRoomClick(rooms[0].id);
        }
    }, [isLoading, rooms, onRoomClick]);
    
    const onJoin = async () => {
        setShowModal(false);
        await reload();
    }

    return (
        <>
            <MainCard name={'Комнаты'} className='overflow-y-auto overflow-x-hidden flex flex-col gap-2.5'>
                {rooms.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {rooms.map(room => (
                            <div
                                key={room.id}
                                onClick={() => onRoomClick(room.id)}
                            >
                                <RoomCard room={room} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-4 text-center text-gray-500 dark:text-gray-400 text-xs">
                        <span>Комнат пока нет</span>
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center w-full h-14 rounded-lg border border-dashed 
                        border-[#d3bc8e]/30 bg-[#17202e]/30 text-[#d3bc8e]/70 
                        hover:text-[#d3bc8e] hover:border-[#d3bc8e]/60 hover:bg-[#17202e]/60 
                        transition-all duration-300 cursor-pointer"
                >
                    <FiPlus className="w-6 h-6" />
                </button>
            </MainCard>

            {showModal && (
                <RoomJoinModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onJoin={() => onJoin()} // надо сделать запрос в апи ещё за новыми комнатами
                />
            )}
        </>
    );
};