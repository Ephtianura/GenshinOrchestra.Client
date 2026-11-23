import type { GenshinInstruments } from "./GenshinInstruments";

export interface UserResponse {
    id: string;
    name: string;
    uid: number | null;
    genshinNickname: string | null;
    avatarUrl: string | null;
}

export interface RoomResponse {
    id: string;
    name: string;
    isActive: boolean;
    maxPlayers: number;
    playersCount: number
    createdAt: string; // ISO 8601
}

export interface RoomMemberResponse {
    userId: string;
    name: string;
    inGameNick?: string | null;
    role: RoomRole;
    status: MemberStatus;
    avatarUrl?: string | null;
}
export enum MemberStatus {
    Offline = "Offline",
    NotReady = "NotReady",
    Ready = "Ready"
}
export enum RoomRole {
    Conductor = "Conductor",
    Musician = "Musician"
}

export interface ClientStatusResponse {
   status: MemberStatus, 
   instrument: GenshinInstruments 
}

export interface UserUpdateInfoEvent {
  userId: string;
  nameChanged: boolean;
  name: string | null;
  enkaProfileChanged: boolean;
  nickname: string | null;
  iconUrl: string | null;
}
