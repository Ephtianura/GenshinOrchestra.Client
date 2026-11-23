import { useCallback, useState } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { MainCard } from "../components/MainCard";
import { PingIndicator } from "../components/PingIndicator";
import Profile from "../components/Profile";
import { ReadyButton } from "../components/ReadyButton";
import { RoomMembersList } from "../components/RoomMembersList";
import { RoomsList } from "../components/RoomsList";
import { UrInstrument } from "../components/UrInstrument";
import { useAuth } from "../components/AuthContext";
import { TrackCountdown } from "../components/TrackCountdown";
import { useStatus } from "../functions/useStatus";
import { useTrackReceiver } from "../functions/useTrackReceiver";
import { usePing } from "../functions/usePing";

export default function Home() {
    const { displayPing, serverDeltaMsRef } = usePing();

    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

    const { user } = useAuth();
    if (!user) return;

    const { isReady, instrument, toggleReady } = useStatus(selectedRoomId, user.id ?? "");

    const startTime = useTrackReceiver(isReady, selectedRoomId, serverDeltaMsRef);

    const handleOwnLeave = useCallback((roomId: string) => {
        setSelectedRoomId(current => current === roomId ? null : current);
    }, []);

    return (
        <div className='flex flex-col w-full h-full relative'>
            <div className="absolute right-2 top-2 z-10">
                <PingIndicator
                    displayPing={displayPing}
                    serverDeltaMsRef={serverDeltaMsRef}
                />
            </div>
            <Group orientation="vertical" className="h-full w-full overflow-hidden">

                <Panel defaultSize="90%" minSize="90%" maxSize="100%" >
                    <Group orientation="horizontal" className="h-full w-full overflow-hidden">
                        <Panel defaultSize="25%" minSize="15%" maxSize="40%" collapsible collapsedSize="0%" >
                            <RoomsList
                                userId={user.id}
                                onRoomClick={setSelectedRoomId}
                                onOwnLeave={handleOwnLeave}
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

                                    <div className="absolute top-4 right-4">
                                        <TrackCountdown
                                            startTime={startTime}
                                            serverDeltaMs={serverDeltaMsRef.current}
                                        />
                                    </div>

                                    {/* Центральный блок с инструментом */}
                                    <UrInstrument initInstrument={instrument} />

                                    {/* Готов */}
                                    <ReadyButton
                                        roomId={selectedRoomId}
                                        userId={user.id}
                                        isReady={isReady}
                                        toggleReady={toggleReady}
                                    />

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