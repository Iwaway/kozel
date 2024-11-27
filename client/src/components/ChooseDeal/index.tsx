import { useTranslation } from "react-i18next";
import { CardSuits, Deals } from "../../enums/gameCardEnums";


export const ChooseDeal = (props: {onSubmit: (deal: Deals) => void}) => {
    const { t } = useTranslation();

    return (
        <div className="z-[101] gap-[8px] h-full flex flex-col">
            <p>{t('game.chooseDealTitle')}:</p>
            <button className="bg-orange-500 p-2 rounded-[6px] border-[2px] border-orange-900 w-full text-sm flex flex-row items-center justify-center gap-1" onClick={() => props.onSubmit(Deals.all)}>
                {t('game.deals.all')}
            </button>
            <button className="bg-orange-500 p-2 rounded-[6px] border-[2px] border-orange-900 w-full text-sm flex flex-row items-center justify-center gap-1" onClick={() => props.onSubmit(Deals.one)}>
                {t('game.deals.one')} 
            </button>
            <button className="bg-orange-500 p-2 rounded-[6px] border-[2px] border-orange-900 w-full text-sm flex flex-row items-center justify-center gap-1" onClick={() => props.onSubmit(Deals.pants)}>
                {t('game.deals.pants')} 
            </button>
            <button className="bg-orange-500 p-2 rounded-[6px] border-[2px] border-orange-900 w-full text-sm flex flex-row items-center justify-center gap-1" onClick={() => props.onSubmit(Deals.satellite)}>
                {t('game.deals.satellite')}
            </button>
        </div>
    );
}