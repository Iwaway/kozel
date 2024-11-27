import { useEffect, useState } from "react";
import { useUtils } from "../../utils/useUtils";
import { useDispatch, useSelector } from "react-redux";
import { RootState, store } from "../../app/store";
import { setLobby } from "../../app/features/lobbySlice";
import { useTranslation } from "react-i18next";

export function useHome() {
    const {navigateTo} = useUtils();
    const [isJoin, setIsJoin] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [codeInput, setCodeInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const user = useSelector((state: RootState) => state.user);
    const ws = store.getState().ws.webSocket!;

    const dispatch = useDispatch();
    const { t } = useTranslation();
    
    useEffect(() => {
        if (!user.token) {
            navigateTo('/login');
        }

        ws.onmessage = function(event) {
            const res = JSON.parse(event.data);
            switch (res.route) {
                case 'joinLobby':
                    if (res.status === 'ok') {
                        const lobbyId = res.data.lobbyId;
                        console.log(user.nickname, 'connected.');
                        dispatch(setLobby({lobbyId: lobbyId}));
                        navigateTo('/lobby');
                    } else {
                        const messageError = res.data.message;
                        setErrorMessage(messageError);
                    }
                    break;
                default:
                    break;
            };
          };
    }, []);

    const onJoinSubmit = () => {
        if (codeInput !== '') {
            ws.send(JSON.stringify({route: 'lobby', data: {route: 'joinLobby', data: {lobbyId: codeInput, nickname: user.nickname, password: passwordInput}}}));
        }
    };

    const goToProfile = () => {
        navigateTo('/settings');
    };

    return {
        isCreate,
        user,
        isJoin,
        codeInput,
        passwordInput,
        errorMessage,
        t,
        setIsCreate,
        setIsJoin,
        setCodeInput,
        setPasswordInput,
        onJoinSubmit,
        goToProfile,
    };
}