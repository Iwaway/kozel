import { UserCard } from "../../interfaces/game";
import { CardIco } from "../CardIco";


export const CardsToDeal = (props: {tableCards: UserCard[]}) => {
    const { tableCards } = props;

    return (
        <div className="flex justify-center items-center flex-row md:w-[80px] md:h-[120px] w-[60px] h-[80px]">
            <img id="dealBackside" className="md:w-[80px] md:h-[120px] w-[60px] h-[80px] absolute flex justify-center z-[101] items-center" src={require('../../assets/backsideCard.png')}/>
            {Array.from(Array(32).keys()).map((card, index) => {
                const tableCard = tableCards.filter(v => v.card.id === index)[0];
                    if (tableCard) {
                        return(
                            <div id={`dealCard_${index}`} key={`dealCard_${index}`} className="flex flex-col md:w-[80px] md:h-[120px] w-[60px] h-[80px] bg-white border-[1px] border-black items-start justify-end rounded-[6px]  absolute">
                                <p className="absolute -rotate-90 md:text-[12px] text-[8px] origin-left ml-2 text-green-800">{tableCard.nickname}</p>
                                <div className="flex flex-col justify-between items-between md:w-[80px] md:h-[120px] w-[60px] h-[80px]">
                                    <div className="flex flex-col pl-1">
                                        <div className="flex flex-row items-center gap-1">
                                            <p>{tableCard.card.value}</p>
                                            <CardIco suit={tableCard.card.suit}/>
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center gap-1 pl-1 rotate-180">
                                        <p>{tableCard.card.value}</p>
                                        <CardIco suit={tableCard.card.suit}/>
                                    </div>
                                </div>
                            </div>)
                    } else {
                        return (
                            <img id={`dealCard_${index}`} key={`dealCard_${index}`} className="md:w-[80px] md:h-[120px] w-[60px] h-[80px] absolute flex justify-center z-[101] items-center" src={require('../../assets/backsideCard.png')} style={{marginRight: 1*index}}/>
                        )
                    }
            })}
        </div>
    )
}