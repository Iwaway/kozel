const wss = require('./server');
const uuidv4 = require("uuid").v4;
const Chat = require('./controllers/chat');
const chat = new Chat();
const Lobby = require('./controllers/lobby');
const lobby = new Lobby(chat);
const Game = require('./controllers/game');
const game = new Game();

const connections = {};
const lobbies = {};
const games = {};

wss.on('connection', (ws) => {
    const uuid = uuidv4();
    connections[uuid] = ws;
    console.log(uuid, 'connected!');
    ws.on('message', async (data) => {
        const inputData = JSON.parse(data);
        switch (inputData.route) {
            case 'chat':
                console.log('chat');
                console.log('#req:',inputData.data.route, inputData.data.data);
                chat.getMessage(ws, inputData.data.route, inputData.data.data, lobbies);
                break;
            case 'lobby':
                console.log('lobby');
                console.log('#req:',inputData.data.route, inputData.data.data);
                lobby.getMessage(ws, inputData.data.route, inputData.data.data, lobbies);
                break;
            case 'game':
                console.log('game');
                console.log('#req:',inputData.data.route, inputData.data.data);
                game.getMessage(ws, inputData.data.route, inputData.data.lobbyId, inputData.data.data, lobbies, games);
                break;
            default:
                console.log(data);
        }
    });
    ws.on('close', () => {
        handleClose(uuid);
    });
});

const handleClose = (uuid) => {
    console.log(uuid, 'disconnected!');
    const disconnectedUser = connections[uuid];
    lobby.disconnect(disconnectedUser, lobbies);
    delete connections[uuid];
}