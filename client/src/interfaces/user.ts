export interface LobbyUser {
    ws: WebSocket;
    nickname: string;
    isReady: boolean;
    isLeader: boolean;
};