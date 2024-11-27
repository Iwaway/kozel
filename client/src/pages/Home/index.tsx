import { useEffect, useState } from "react";
import { useUtils } from "../../utils/useUtils";
import { RootState, store } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { CreateLobbyModal } from "../../components/CreateLobbyModal";
import { setLobby } from "../../app/features/lobbySlice";
import { useHome } from "./useHome";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";

export const Home = () => {

    const {
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
    } = useHome();

    return(
        <>
            {isCreate && <CreateLobbyModal onClose={() => setIsCreate(false)}/>}
            <div className="flex justify-center items-center flex-col">
                <header className="flex items-center justify-center bg-orange-200 w-full py-2">
                    <div className="flex flex-col justify-center items-center">
                        <h1 className="font-bold">{t('home.title')}</h1>
                        <h2>{t('home.greetings')} {user.nickname}</h2>
                    </div>
                    <button onClick={goToProfile} className="absolute rounded-[6px] right-4 p-1">
                        <ProfileIco/>
                    </button>
                </header>
                <div className="flex flex-col justify-center items-center mt-4 gap-2">
                    <button onClick={() => setIsCreate(!isCreate)} className="p-1 bg-green-300 rounded-[6px] border-[2px] border-green-950">{t('home.createRoom.title')}</button>
                    <div className="flex flex-col items-center justify-center p-2 gap-1" style={isJoin ? {backgroundColor: 'orange', borderRadius: 6} : {}}>
                        <p className="underline" onClick={() => setIsJoin(!isJoin)}>{t('home.joinRoom')}</p>
                        {isJoin &&
                            <>
                                <div className="flex flex-col items-center justify-center">
                                    <p>{t('home.codeLabel')}</p>
                                    <input
                                        className="p-1 border-[2px] border-orange-400 rounded-[6px]"
                                        type="text"
                                        value={codeInput}
                                        onChange={(e) => setCodeInput(e.target.value)}/>
                                </div>
                                <div className="flex flex-col items-center justify-center">
                                    <p>{t('home.passwordLabel')}</p>
                                    <input
                                        className="p-1 border-[2px] border-orange-400 rounded-[6px]"
                                        type="password"
                                        value={passwordInput}
                                        onChange={(e) => setPasswordInput(e.target.value)}/>
                                </div>
                                <p className="text-red-500">{errorMessage}</p>
                                <button disabled={passwordInput==='' || codeInput===''} onClick={onJoinSubmit} className="py-1 px-2 border-[2px] border-orange-800 bg-orange-500 rounded-[6px]">
                                    {t('home.submit')}
                                </button>
                            </>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

const ProfileIco = () => {
    
    return (
        <svg fill="#000000" height={40} width={40} viewBox="0 0 48 48" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <title></title>
                <path d="M24,21A10,10,0,1,1,34,11,10,10,0,0,1,24,21ZM24,5a6,6,0,1,0,6,6A6,6,0,0,0,24,5Z"></path>
                <path d="M42,47H6a2,2,0,0,1-2-2V39A16,16,0,0,1,20,23h8A16,16,0,0,1,44,39v6A2,2,0,0,1,42,47ZM8,43H40V39A12,12,0,0,0,28,27H20A12,12,0,0,0,8,39Z"></path>
            </g>
        </svg>
    )
}