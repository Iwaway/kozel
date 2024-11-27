import { useEffect, useState } from "react";
import { store } from "../../app/store";
import { useDispatch } from "react-redux";
import { setLobby } from "../../app/features/lobbySlice";
import { useUtils } from "../../utils/useUtils";
import { useTranslation } from "react-i18next";


export const CreateLobbyModal = (props: {onClose?: () => void}) => {
    const {onClose} = props;
    const [passwordInput, setPassworInput] = useState('');

    const ws = store.getState().ws.webSocket!;
    const user = store.getState().user!;

    const dispatch = useDispatch();
    const { navigateTo } = useUtils();
    const { t } = useTranslation();

    useEffect(() => {      
        ws.onmessage = function(event) {
            const res = JSON.parse(event.data);
    
            switch (res.route) {
                case 'createLobby':
                    try {
                        dispatch(setLobby({lobbyId: res.data.lobbyId}));
                        setPassworInput('');
                        navigateTo('/lobby');
                    } catch (e) {
                        console.log(e);
                    }
                    break;
                default:
                    break;
            };
          }
      }, []);

    const onSubmit = () => {
        const nickname = user.nickname;
        ws.send(JSON.stringify({route: 'lobby', data: {route: 'createLobby', data: {password: passwordInput, nickname: nickname}}}));
    };

    return (
        <div className="w-full h-full absolute bg-black bg-opacity-50 top-0 flex justify-center items-center">
            <div className="bg-white border-[2px] border-orange-900 rounded-[6px]">
                <div className="bg-orange-300 w-full justify-end flex items-center p-2 rounded-t-[4px]">
                    <button onClick={onClose} className="absolute">
                        <Cross/>
                    </button>
                    <div className="flex w-full h-full justify-center items-center">
                        <p className="">{t('home.createRoom.title')}</p>
                    </div>
                </div>
                <div className="justify-center items-center flex w-full flex-col p-4">
                        <p>{t('home.createRoom.password')}</p>
                        <input
                            className="border-[2px] border-orange-900 rounded-[6px]"
                            value={passwordInput}
                            onChange={(e) => setPassworInput(e.target.value)}
                            type="password"/>
                        <button onClick={onSubmit} disabled={passwordInput===''} className="mt-2 bg-orange-300 p-1 border-[2px] border-orange-900 rounded-[6px]">{t('home.createRoom.submit')}</button>
                </div>
            </div>
        </div>
    )
};

const Cross = () => {
    return (
        <svg fill="#000000" height="20px" width="20px" viewBox="0 0 490 490">
            <g id="SVGRepo_bgCarrier" strokeWidth="0">
            </g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round">
            </g>
            <g id="SVGRepo_iconCarrier">
                <polygon points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490 489.292,457.678 277.331,245.004 489.292,32.337 ">
                </polygon>
            </g>
        </svg>
    )
}