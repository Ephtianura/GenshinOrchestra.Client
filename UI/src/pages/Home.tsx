import { useState } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { MainCard } from "../components/MainCard";
import { PingIndicator } from "../components/PingIndicator";
import Profile from "../components/Profile";
import { ReadyButton } from "../components/ReadyButton";
import { RoomMembersList } from "../components/RoomMembersList";
import { RoomsList } from "../components/RoomsList";
import { UrInstrument } from "../components/UrInstrument";
import { useAuth } from "../components/AuthContext";

export default function Home() {
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const { user } = useAuth();
    if (!user) return;

    return (
        <div className='flex flex-col w-full h-full relative'>
            <div className="absolute right-2 top-2 z-10">
                <PingIndicator />
            </div>
            <Group orientation="vertical" className="h-full w-full overflow-hidden">

                <Panel defaultSize="90%" minSize="90%" maxSize="100%" >
                    <Group orientation="horizontal" className="h-full w-full overflow-hidden">
                        <Panel defaultSize="25%" minSize="15%" maxSize="40%" collapsible collapsedSize="0%" >
                            <RoomsList
                                onRoomClick={(roomId) => setSelectedRoomId(roomId)}
                            />
                        </Panel>

                        <Separator className="relative w-4 my-4 flex items-center justify-center transition-colors cursor-col-resize group">
                            <div className="absolute h-full w-px group-hover:bg-[#978ed3]/20 group-active:bg-[#828aae]/50  transition-colors duration-300" />
                        </Separator>

                        {/* Главная секция */}
                        <Panel defaultSize="50%" minSize="45%" maxSize="100%" className="h-full">
                            {selectedRoomId && (

                                <MainCard className="bg-[#121925]/80  justify-between p-8 overflow-y-auto overflow-x-hidden">

                                    {/* Декоративные орнаменты по углам */}
                                    <div className="corners-ornament top-4 left-4 border-t-2 border-l-2" />
                                    <div className="corners-ornament top-4 right-4 border-t-2 border-r-2" />
                                    <div className="corners-ornament bottom-4 left-4 border-b-2 border-l-2" />
                                    <div className="corners-ornament bottom-4 right-4 border-b-2 border-r-2" />

                                    {/* Центральный блок с инструментом */}
                                    <UrInstrument />

                                    {/* Готов */}
                                    <ReadyButton roomId={selectedRoomId} userId={user.id} />

                                </MainCard>
                            )}

                        </Panel>

                        <Separator className="relative w-4 my-4 flex items-center justify-center transition-colors cursor-col-resize group">
                            <div className="absolute h-full w-px group-hover:bg-[#978ed3]/20 group-active:bg-[#828aae]/50  transition-colors duration-300" />
                        </Separator>

                        <Panel defaultSize="25%" minSize="15%" maxSize="40%" collapsible collapsedSize="0%">
                            {selectedRoomId && (
                                <RoomMembersList roomId={selectedRoomId} />
                            )}
                        </Panel>

                    </Group>
                </Panel>


                <Panel defaultSize="9%" minSize="9%" maxSize="9%" collapsible collapsedSize="0%" className="overflow-hidden!" >
                    <Profile />
                </Panel>

            </Group >
        </div >
    );
}

/*const me: string = "22222222-2222-2222-2222-222222222222"

const member1: RoomMemberResponse = {
    userId: '11111111-1111-1111-1111-111111111111',
    name: 'Ephtianura',
    inGameNick: 'Константин',
    role: RoomRole.Musician,
    status: MemberStatus.NotReady,
    avatarUrl: null
};
const member2: RoomMemberResponse = {
    userId: '22222222-2222-2222-2222-222222222222',
    name: 'Vortex',
    inGameNick: 'Алексей',
    role: RoomRole.Musician,
    status: MemberStatus.Ready,
    avatarUrl: null
};
const member3: RoomMemberResponse = {
    userId: '33333333-3333-3333-3333-333333333333',
    name: 'Shadow',
    inGameNick: 'Максим',
    role: RoomRole.Musician,
    status: MemberStatus.Offline,
    avatarUrl: null
};
const members = [member1, member2, member3, member2, member3]
const rooms: RoomResponse[] = [
    {
        id: "1",
        name: "Концерт Monody (Liyue Theme)",
        isActive: true,
        maxPlayers: 4,
        playersCount: 2,
        createdAt: new Date().toISOString(),
    },
    {
        id: "2",
        name: "Фамильные хроники Фонтейна",
        isActive: true,
        maxPlayers: 4,
        playersCount: 4,
        createdAt: new Date().toISOString(),
    },
    {
        id: "3",
        name: "Ночная репетиция Инадзумы",
        isActive: false,
        maxPlayers: 2,
        playersCount: 0,
        createdAt: new Date().toISOString(),
    },
];
*/
/* <Separator className="relative h-4 mx-4 flex items-center justify-center transition-colors cursor-row-resize group">
                    <div className="absolute w-full h-px group-hover:bg-[#978ed3]/20 group-active:bg-[#828aae]/50 transition-colors duration-300" />
 </Separator> */