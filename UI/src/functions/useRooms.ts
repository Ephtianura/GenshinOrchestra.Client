import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "./api";
import { signalRService } from "./signalrService";
import type { RoomMemberResponse, RoomResponse } from "../types/types";

export function useRooms() {
    const [rooms, setRooms] = useState<RoomResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadRooms = useCallback(async () => {
        try {
            const data = await apiFetch<RoomResponse[]>("client/rooms");
            setRooms(data);
        } catch (error) {
            console.error("Не удалось загрузить комнаты:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const handleUserJoined = (
            _member: RoomMemberResponse,
            roomId: string,
            playersCount: number
        ) => {
            setRooms(prev => prev.map(room =>
                room.id === roomId
                    ? { ...room, playersCount: playersCount }
                    : room
            ));
        };

        const handleUserLeave = (
            _userId: string,
            roomId: string,
            playersCount: number
        ) => {
            setRooms(prev => prev.map(room =>
                room.id === roomId
                    ? { ...room, playersCount: playersCount }
                    : room
            ));
        };

        signalRService.on("UserJoined", handleUserJoined);
        signalRService.on("UserLeave", handleUserLeave);

        loadRooms();

        return () => {
            signalRService.off("UserJoined", handleUserJoined);
            signalRService.off("UserLeave", handleUserLeave);
        };
    }, [loadRooms]);

    return {
        rooms,
        isLoading,
        reload: loadRooms
    };
}