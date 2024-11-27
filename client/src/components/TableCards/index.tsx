import { useSelector } from "react-redux";
import { UserCard } from "../../interfaces/game"
import { RootState } from "../../app/store";
import { CardIco } from "../CardIco";


export const TableCards = (props: {cards?: UserCard[]}) => {

    const { cards } = props;
    const game = useSelector((state: RootState) => state.game.game)!;

    if (!cards) {
        return <div/>
    }

    const RenderTable = () => {
        if (cards.length > game.users.length) {
            return (
                <div className="flex flex-col gap-y-[6px] gap-x-10 md:gap-x-16 flex-wrap [flex-flow:row_wrap] justify-center items-center">
                    {Array.from(Array(cards.length/game.users.length).keys()).map((value, cardN) => {
                        return (
                            <div className="flex flex-row justify-center items-center">
                                {game.users.map((user, index) => {
                                    const card = cards.filter(v => v.nickname === user.nickname)[cardN];
                                    return(
                                        <div key={index} className="flex flex-col md:w-[80px] md:h-[120px] w-[60px] h-[80px] bg-white border-[1px] border-black items-start justify-end rounded-[6px] md:-ml-[40px] -ml-[30px]" style={{zIndex: 50+index}}>
                                            <p className="absolute -rotate-90 md:text-[12px] text-[8px] origin-left ml-2 text-green-800">{card.nickname}</p>
                                            <div className="flex flex-col justify-between items-between md:w-[80px] md:h-[120px] w-[60px] h-[80px]">
                                                <div className="flex flex-col pl-1">
                                                    <div className="flex flex-row items-center gap-1">
                                                        <p>{card.card.value}</p>
                                                        <CardIco suit={card.card.suit}/>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row items-center gap-1 pl-1 rotate-180">
                                                    <p>{card.card.value}</p>
                                                    <CardIco suit={card.card.suit}/>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            )
        } else {
            return (
                <div className="flex flex-row">
                    {cards.map((card, index) => {
                        return (
                            <div key={index} className="flex flex-col md:w-[80px] md:h-[120px] w-[60px] h-[80px] bg-white border-[1px] border-black items-start justify-end rounded-[6px] md:-ml-[40px] -ml-[30px]" style={{zIndex: 50+index}}>
                                <p className="absolute -rotate-90 md:text-[12px] text-[8px] origin-left ml-2 text-green-800">{card.nickname}</p>
                                <div className="flex flex-col justify-between items-between md:w-[80px] md:h-[120px] w-[60px] h-[80px]">
                                    <div className="flex flex-col pl-1">
                                        <div className="flex flex-row items-center gap-1">
                                            <p>{card.card.value}</p>
                                            <CardIco suit={card.card.suit}/>
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center gap-1 pl-1 rotate-180">
                                        <p>{card.card.value}</p>
                                        <CardIco suit={card.card.suit}/>
                                    </div>
                                </div>
                            </div>  
                        )
                    })}
                </div>
            )
        }
    }

    return <RenderTable/>;
}