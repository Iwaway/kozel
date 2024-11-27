import { SetStateAction, useEffect, useState } from "react";
import { store } from "../../app/store";
import { useDispatch } from "react-redux";
import { setLobby } from "../../app/features/lobbySlice";
import { useUtils } from "../../utils/useUtils";
import { useTranslation } from "react-i18next";
import { LobbyUser } from "../../interfaces/lobbyUser";

interface ChooseTeammateModalProps {
    onClose: () => void;
    lobbyUsers: LobbyUser[];
}


export const ChooseTeammateModal = (props: ChooseTeammateModalProps) => {
    const {onClose, lobbyUsers} = props;
    const [teammateNickname, setTeammateNickname] = useState('');

    const ws = store.getState().ws.webSocket!;
    const user = store.getState().user!;
    const lobbyId = store.getState().lobby.lobbyId!;
    
    const { t } = useTranslation();

    useEffect(() => {
        if (lobbyUsers && teammateNickname === '') {
            setTeammateNickname(lobbyUsers.filter(v => v.nickname != user.nickname)[0].nickname);
        }
      }, []);

    const onSubmit = () => {
       console.log(teammateNickname);
       ws.send(JSON.stringify({route: 'game', data: {route: 'initGame', lobbyId: lobbyId, data: {teammateNickname: teammateNickname}}}));
       onClose();
    };

    return (
        <div className="w-full h-full absolute bg-black bg-opacity-50 top-0 flex justify-center items-center z-[100]">
            <div className="w-3/4 bg-white border-[2px] border-orange-900 rounded-[6px]">
                <div className=" bg-orange-300 rounded-t-[4px] w-full">
                    <div className="flex items-center p-1 justify-center">
                        <p className="absolute">{t('lobby.modal.title')}</p>
                        <button onClick={onClose} className="ml-[95%]">
                            <Cross/>
                        </button>
                    </div>
                </div>
                <div className="justify-center items-center flex w-full flex-col p-4 gap-2">
                        <p>{t('lobby.modal.subtitle')}</p>
                        <select className="w-1/2 p-2" value={teammateNickname} onChange={(e) => setTeammateNickname(e.target.value)}>
                            {lobbyUsers?.map((lobbyUser) => {
                                return (
                                    <>
                                        {
                                        (lobbyUser.nickname !== user.nickname) &&
                                            <option value={lobbyUser.nickname}>{lobbyUser.nickname}</option>
                                        }
                                    </>
                                );
                            })}
                        </select>
                        <button onClick={onSubmit} className="mt-2 bg-orange-300 p-1 border-[2px] border-orange-900 rounded-[6px]">{t('lobby.modal.submit')}</button>
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