class Chat{
    actions = {
        message: (ws, { nickname, time, text, lobbyId }, lobbies) => {
            const res = {route: 'message', data: {nickname, time, text}};
            console.log("#res:", res);
            const lobby = lobbies['lobby#'+lobbyId];
            lobby.users.forEach(user => {
                user.ws.send(JSON.stringify(res));
            });
        },
    }

    getMessage(ws, action, data, lobbies){
        if(this.actions[action]) this.actions[action](ws, data, lobbies);
    }
}

module.exports = Chat;