import { useEffect, useState } from "react";
import { RootState, store } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { useUtils } from "../../utils/useUtils";
import { setLobbyUsers } from "../../app/features/lobbyUsersSlice";
import { LobbyUser } from "../../interfaces/lobbyUser";
import { useTranslation } from "react-i18next";
import { setGame } from "../../app/features/gameSlice";
import { Game } from "../../interfaces/game";

export function useLobby() {
    const [ready, setReady] = useState(false);
    const [leader, setLeader] = useState(false);
    const [isStartGame, setStartGame] = useState(false);
    const [isModal, setIsModal] = useState(false);
    const [message, setMessage] = useState<string | undefined>();

    const lobbyId = store.getState().lobby.lobbyId;
    const userRedux = store.getState().user; 

    const ws = useSelector((state: RootState) => state.ws.webSocket);
    const lobbyUsers = useSelector((state: RootState) => state.lobbyUsers.users);

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { navigateTo } = useUtils();

    var timeOut: NodeJS.Timeout;

    useEffect(() => {
        if (!userRedux.token) { 
            navigateTo('/login');
        }

        if (lobbyUsers.length === 0) {
            setUsers();
        }

        if (ws) {
            ws.addEventListener('message', (event) => {
                const res = JSON.parse(event.data);
         
                switch (res.route) {
                    case 'getInfo':
                        if (res.data.route === 'updateUsers' && res.status === 'ok') {
                            dispatch(setLobbyUsers({users: res.data.users as LobbyUser[]}));
                            console.log('NEW USERS:', lobbyUsers);
                        };
                        break;
                    case 'initGame':
                        if (res.status === 'ok') {
                            dispatch(setGame({game: res.data.game as Game}));
                            console.log(store.getState().game);
                            navigateTo('/game');
                        };
                        break;
                    default:
                        break;
                };
            });
        }
    }, []);

    useEffect(() => {
        console.log('Updated users:', lobbyUsers);
        const leader = lobbyUsers.filter(v => v.isLeader === true);
        if (leader.length > 0 && leader[0].nickname === userRedux.nickname) {
            setLeader(true);
        }
        setStartGame(lobbyUsers.every(v => v.isReady) && lobbyUsers.length === 4);
    }, [lobbyUsers]); 

    useEffect(() => {
        getReady();
    }, [ready]); 

    const disconnect = () => {
        if (ws && ws.readyState === 1) {
            ws.send(JSON.stringify({route: 'lobby', data: {route: 'disconnect', data: {lobbyId: lobbyId}}}));
            navigateTo('/'); 
        } 
    };

    const setUsers = () => {
        if (ws && ws.readyState === 1) {
            ws.send(JSON.stringify({route: 'lobby', data: {route: 'getInfo', data: {action: 'updateUsers', lobbyId: lobbyId}}}));
        };
    };

    const getReady = () => {
        if (ws && ws.readyState === 1) {
            ws.send(JSON.stringify({route: 'lobby', data: {route: 'setReady', data: {lobbyId: lobbyId, ready: ready}}}));
        };
    };

    const startGame = () => {
        console.log('start game');
        setIsModal(true);
    };

    const copyCode = () => {
        if (lobbyId) {
            navigator.clipboard.writeText(lobbyId);
            showMessage(t('lobby.copy'));
        }
    };

    const showMessage = (message: string) => {
        setMessage(message);
        clearTimeout(timeOut);

        timeOut = setTimeout(() => {
            setMessage(undefined);
        }, 2000);
    };

    return {
        lobbyId,
        ready,
        lobbyUsers,
        leader,
        isStartGame,
        t,
        isModal,
        message,
        setIsModal,
        startGame,
        setReady,
        disconnect,
        copyCode,
    };
}