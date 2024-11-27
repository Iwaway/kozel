const wss = require('./server');
const uuidv4 = require("uuid").v4;
const Chat = require('./controllers/chat');
const chat = new Chat();
const Lobby = require('./controllers/lobby');
const lobby = new Lobby(chat);

const connections = {};
const lobbies = {};

wss.on('connection', (ws) => {
    const uuid = uuidv4();
    connections[uuid] = ws;
    console.log(uuid, 'connected!');
    ws.on('message', async (data) => {
        const inputData = JSON.parse(data);
        switch (inputData.route) {
            case 'lobby':
                console.log('lobby');
                console.log('#req:',inputData.data.route, inputData.data.data);
                lobby.getMessage(ws, inputData.data.route, inputData.data.data, lobbies);
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