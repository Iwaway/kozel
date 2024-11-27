import { useTranslation } from "react-i18next";
import { CardSuits } from "../../enums/gameCardEnums";
import { useState } from "react";
import { CardIco } from "../CardIco";


export const ChooseTrump = (props: {onSubmit: (trump?: CardSuits) => void; isLast: boolean}) => {
    const { t } = useTranslation();

    const [show, setShow] = useState(true);

    return (
        <div className="z-[101] absolute gap-[8px] flex flex-col text-white bg-black bg-opacity-[60%] h-full justify-center px-12 rounded-[8px]" style={!show ? {backgroundColor: 'rgba(0,0,0,0.1)', color: '#000000'} : {}}>
            <div className="h-1/4 p-2">
                <button className="font-bold underline" onClick={() => setShow(!show)}>{t('game.chooseTrump.title')}:</button>
            </div>
            <div className="h-3/4 flex gap-2 flex-col text-black font-bold">
                {
                    show && (
                        <>
                            <button className="bg-orange-500 p-2 rounded-[6px] border-[2px] border-orange-900 w-full text-sm flex flex-row items-center justify-center gap-1" onClick={() => props.onSubmit(CardSuits.spades)}>
                                {t('game.trumps.spades')} <CardIco suit={CardSuits.spades}/>
                            </button>
                            <button className="bg-orange-500 p-2 rounded-[6px] border-[2px] border-orange-900 w-full text-sm flex flex-row items-center justify-center gap-1" onClick={() => props.onSubmit(CardSuits.hearts)}>
                                {t('game.trumps.hearts')} <CardIco suit={CardSuits.hearts}/>
                            </button>
                            <button className="bg-orange-500 p-2 rounded-[6px] border-[2px] border-orange-900 w-full text-sm flex flex-row items-center justify-center gap-1" onClick={() => props.onSubmit(CardSuits.clubs)}>
                                {t('game.trumps.clubs')} <CardIco suit={CardSuits.clubs}/>
                            </button>
                            <button className="bg-orange-500 p-2 rounded-[6px] border-[2px] border-orange-900 w-full text-sm flex flex-row items-center justify-center gap-1" onClick={() => props.onSubmit(CardSuits.diamonds)}>
                                {t('game.trumps.diamonds')} <CardIco suit={CardSuits.diamonds}/>
                            </button>
                            {!props.isLast && <button className="bg-orange-200 p-1 rounded-[6px] border-[2px] border-orange-900 w-full text-sm" onClick={() => props.onSubmit()}>{t('game.chooseTrump.pass')}</button>}
                        </>
                    )
                }
            </div>
        </div>
    );
}