import { Chat } from "../../components/Chat";
import { ChooseTeammateModal } from "../../components/ChooseTeammateModal";
import { useLobby } from "./useLobby";

export const Lobby = () => {
    const {
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
    } = useLobby();

    return (
        <>
            {isModal && <ChooseTeammateModal lobbyUsers={lobbyUsers} onClose={() => setIsModal(false)}/>}
            {message && (
                <div className="absolute top-0 min-w-full justify-center flex items-center pt-2">
                    <p className="p-2 bg-green-300 rounded-xl text-[12px]">{message}</p>
                </div>
            )}
            <main className="p-3 pt-12 flex justify-between flex-col max-h-full min-h-full max-w-full min-w-full absolute top-0">
                <div className="flex justify-center items-center flex-col">
                    <div className="flex justify-center items-center flex-col">
                        <h1 className="font-bold">{t('lobby.title')}</h1>
                        <button onClick={copyCode} className="text-sm bg-slate-100 p-2 rounded-[6px]">{t('lobby.subtitle')} {lobbyId}</button>
                    </div>
                    <div className="mt-4 w-full">
                        <div className="flex justify-center items-center flex-col">
                            <h1>{t('lobby.ready.title')}</h1>
                            {ready
                                ? <button onClick={() => setReady(false)} className="p-1 bg-red-500 rounded-[6px] border-[2px] border-red-900">{t('lobby.ready.noBtn')}</button>
                                : <button onClick={() => setReady(true)} className="p-1 bg-green-500 rounded-[6px] border-[2px] border-green-900">{t('lobby.ready.yesBtn')}</button>
                            }
                        </div>

                        {lobbyUsers?.map((user, index) => {
                            return(
                                <div key={index}>
                                    <div className="flex flex-row gap-1 items-center">
                                        {user.isLeader && <Crown/>}
                                        <p className="font-bold">{user.nickname}:</p>
                                        <p>{user.isReady ? t('lobby.ready.yes') : t('lobby.ready.no')};</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="flex justify-center items-center flex-col gap-1">
                    {leader &&
                        <button
                            onClick={startGame}
                            style={isStartGame ? {backgroundColor: '#22c55e', borderColor: '#14532d'} : {backgroundColor: '#6b7280', borderColor: '#111827'}} className="p-1 border-[2px] rounded-[6px]"
                            disabled={!isStartGame}>
                            {t('lobby.start')}
                        </button>
                    }
                    <Chat/>
                    <button onClick={disconnect} className="text-red-900 bg-red-500 p-1 border-[2px] border-red-900 rounded-[6px]">{t('lobby.disconnect')}</button>
                </div>
            </main>
        </>
    )
}

const Crown = () => {
    return (
        <svg fill="#fefb00" height="20px" width="22px" version="1.1" id="Capa_1" viewBox="0 0 250 250" stroke="#fefb00" strokeWidth="1">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#050505" strokeWidth="6.6">
                <path d="M220,98.865c0-12.728-10.355-23.083-23.083-23.083s-23.083,10.355-23.083,23.083c0,5.79,2.148,11.084,5.681,15.14 l-23.862,21.89L125.22,73.002l17.787-20.892l-32.882-38.623L77.244,52.111l16.995,19.962l-30.216,63.464l-23.527-21.544 c3.528-4.055,5.671-9.344,5.671-15.128c0-12.728-10.355-23.083-23.083-23.083C10.355,75.782,0,86.137,0,98.865 c0,11.794,8.895,21.545,20.328,22.913l7.073,84.735H192.6l7.073-84.735C211.105,120.41,220,110.659,220,98.865z"></path>
            </g>
            <g id="SVGRepo_iconCarrier">
                <path d="M220,98.865c0-12.728-10.355-23.083-23.083-23.083s-23.083,10.355-23.083,23.083c0,5.79,2.148,11.084,5.681,15.14 l-23.862,21.89L125.22,73.002l17.787-20.892l-32.882-38.623L77.244,52.111l16.995,19.962l-30.216,63.464l-23.527-21.544 c3.528-4.055,5.671-9.344,5.671-15.128c0-12.728-10.355-23.083-23.083-23.083C10.355,75.782,0,86.137,0,98.865 c0,11.794,8.895,21.545,20.328,22.913l7.073,84.735H192.6l7.073-84.735C211.105,120.41,220,110.659,220,98.865z"></path>
            </g>
        </svg>
    )
}