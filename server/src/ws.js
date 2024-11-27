const wss = require('./server');
const uuidv4 = require("uuid").v4;

const connections = {};

wss.on('connection', (ws) => {
    const uuid = uuidv4();
    connections[uuid] = ws;
    console.log(uuid, 'connected!');
    ws.on('message', async (data) => {
        const inputData = JSON.parse(data);
        console.log(inputData);
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