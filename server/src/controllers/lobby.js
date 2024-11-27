const utils = require("../utils/utils");

class Lobby{

    constructor(chat) {
        this.chat = chat;
    }

    actions = {
        createLobby: (ws, {password, nickname}, lobbies) => {
            try {
                const lobbyId = utils.getLobbyId();
                lobbies['lobby#'+lobbyId] = {
                    lobbyId: lobbyId,
                    password: password,
                    users: [
                        {ws: ws, nickname: nickname, isReady: false, isLeader: true},
                    ],
                };
                const res = {route: 'createLobby', status: 'ok', data: {lobbyId}};
                console.log('#res:', res);
                ws.send(JSON.stringify(res));
                this.actions.getInfo(ws, {action: 'updateUsers', lobbyId}, lobbyId, lobbies);
                this.chat.getMessage(ws, 'message', { nickname: 'lobby.chat.loginfo', time: Date.now(), text: `${nickname} connected!`, lobbyId: lobbyId }, lobbies);
            } catch (e) {
                const res = {route: 'createLobby', status: 'error', data: {e}};
                console.log('#res:', res);
                ws.send(JSON.stringify(res));
            }
        },

        joinLobby: (ws, {lobbyId, password, nickname}, lobbies) => {
            try {
                const lobby = lobbies['lobby#'+lobbyId];
                if (!lobby) {
                    const res = {route: 'joinLobby', status: 'error', data: {message: "Incorrect code."}};
                    console.log('#res:', res);
                    ws.send(JSON.stringify(res));
                    return false;
                }

                const correctCode = lobby.lobbyId;
                if (correctCode !== lobbyId) {
                    const res = {route: 'joinLobby', status: 'error', data: {message: "Incorrect code."}};
                    console.log('#res:', res);
                    ws.send(JSON.stringify(res));
                    return false;
                }
                if (lobby.password === password) {
                    const lobbyUsers = lobby.users;
                    if (lobbyUsers.length === 4) {
                        const res = {route: 'joinLobby', status: 'error', data: {message: "Lobby is full."}};
                        console.log('#res:', res);
                        ws.send(JSON.stringify(res));
                        return false;
                    }
                    lobbyUsers.push({ws: ws, nickname: nickname, isReady: false, isLeader: false});
                    const res = {route: 'joinLobby', status: 'ok', data: {lobbyId, nickname}};
                    console.log('#res:', res);
                    ws.send(JSON.stringify(res));
                    this.actions.getInfo(ws, {action: 'updateUsers', lobbyId}, lobbies);
                    this.chat.getMessage(ws, 'message', { nickname: 'lobby.chat.loginfo', time: Date.now(), text: `${nickname} connected!`, lobbyId: lobby.lobbyId }, lobbies);
                } else {
                    const res = {route: 'joinLobby', status: 'error', data: {message: "Incorrect password."}};
                    console.log('#res:', res);
                    ws.send(JSON.stringify(res));
                    return false;
                }
            } catch (e) {
                const res = {route: 'joinLobby', status: 'error', data: {message: "Something goes wrong."}};
                console.error(e);
                console.log('#res:', res);
                ws.send(JSON.stringify(res));
                return false;
            }
        },

        setReady: (ws, {lobbyId, ready}, lobbies) => {
            try {
                const lobby = lobbies['lobby#'+lobbyId];
                const userIndex = lobby.users.findIndex(v => v.ws === ws);
                const user = lobby.users[userIndex];
                user.isReady = ready;
                this.actions.getInfo(ws, {action: 'updateUsers', lobbyId}, lobbies);
                const text = ready ? `${user.nickname} gets ready!` : `${user.nickname} not ready yet!`
                this.chat.getMessage(ws, 'message', { nickname: 'lobby.chat.loginfo', time: Date.now(), text: text, lobbyId: lobby.lobbyId }, lobbies);
            } catch (e) {
                const res = {route: 'setReady', status: 'error', data: {message: "Something goes wrong."}};
                console.error(e);
                console.log('#res:', res);
                ws.send(JSON.stringify(res));
                return false;
            }
        },

        getInfo: (ws, {action, lobbyId}, lobbies) => {
            try {
                switch (action) {
                    case 'updateUsers':
                        const lobby = lobbies['lobby#'+lobbyId];
                        console.log(lobbies);
                        console.log(lobby);
                        const res = {route: 'getInfo', status: 'ok', data: {route: 'updateUsers', users: lobby.users}};
                        console.log('#res:', res);
                        lobby.users.forEach(user => {
                            user.ws.send(JSON.stringify(res));
                        });
                        return true;
                    default:
                        break;
                }
            } catch (e) {
                    const res = {route: 'getInfo', status: 'error', data: {route: action, message: "Something goes wrong."}};
                    console.error(e);
                    console.log('#res:', res);
                    ws.send(JSON.stringify(res));
                    return false;
                }
            },
        
        disconnect: (ws, {lobbyId}, lobbies) => {
            this.disconnect(ws, lobbies);
        }
    }

    getMessage(ws, action, data, lobbies){
        if(this.actions[action]) this.actions[action](ws, data, lobbies);
    };

    disconnect(ws, lobbies){
        // const lobby = lobbies.filter(v => v.users.some(user => user.ws === ws));
        var lobbyFilt = Object.fromEntries(Object.entries(lobbies).filter(([k,v]) => v.users.some(user => user.ws === ws)));
        if (!utils.isEmpty(lobbyFilt)) {
            const lobbyKey = Object.keys(lobbyFilt)[0];
            console.log(lobbyKey);
            const lobby = lobbies[lobbyKey];
            const userIndex = lobby.users.findIndex(v => v.ws === ws);
            const user = lobby.users[userIndex];
            this.chat.getMessage(ws, 'message', { nickname: 'lobby.chat.loginfo', time: Date.now(), text: `${user.nickname} disconnected!`, lobbyId: lobby.lobbyId }, lobbies);
            lobby.users.splice(userIndex, 1);
            this.actions.getInfo(ws, {action: 'updateUsers', lobbyId: lobby.lobbyId}, lobbies);
        };
    };
}

module.exports = Lobby;