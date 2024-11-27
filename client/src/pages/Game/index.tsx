import { CardIco } from "../../components/CardIco";
import { CardsToDeal } from "../../components/CardsToDeal";
import { ChooseDeal } from "../../components/ChooseDeal";
import { ChooseTrump } from "../../components/ChooseTrump";
import { EndGameModal } from "../../components/EndGameModal";
import { TableCards } from "../../components/TableCards";
import { CardSuits } from "../../enums/gameCardEnums";
import { useGame } from "./useGame";


export const Game = () => {

    const {
        game,
        user,
        isLastTrumped,
        messages,
        errorMessage,
        gameMessage,
        chooseTrumpSubmit,
        chooseDealSubmit,
        drawCard,
        resetGame,
        dealerNickname,
        messagesEndRef,
        gameUsers,
        disableTurn,
        endGameModal,
        isDeal,
        t,
        tableCards,
    } = useGame();

    return (
        <main className="absolute min-w-full min-h-full flex flex-col overflow-hidden">
            {endGameModal &&
                <EndGameModal game={game!} winnerTeam={game?.teams[0]!}/>
            }
            {(gameMessage || errorMessage) && (
                <div className="absolute w-full h-3/4 flex justify-center items-center z-[102] transition-opacity">
                    <p className="p-2 text-white bg-black bg-opacity-75 max-w-[40%] rounded-xl md:text-[18px] text-[14px] font-bold" style={errorMessage ? {backgroundColor: 'red', color: 'black'} : {}}>{t(gameMessage || errorMessage || '')}</p>
                </div> 
            )}
            <div id={'player_1'} className="absolute min-h-[25%] max-h-[25%] w-full bg-gray-100 flex justify-end items-center flex-col pb-4">
                <div className="w-full justify-center absolute top-0 items-center flex flex-col px-4 py-2 md:text-base text-[12px]">
                        {game?.trump !== '' && (
                            <div className="flex flex-row items-center gap-1">
                                <p>{t('game.trump')}: <span className="lowercase">{t('game.trumps.'+game?.trump)}</span></p>
                                <CardIco suit={game?.trump as CardSuits}/>
                            </div>
                        )}
                        {game?.isEgg && (
                            <p>{t('game.eggsTitle')}: {t('game.eggsDescription')}</p>
                        )}
                    <div className="flex flex-row justify-between w-full">
                        <div className="flex justify-center flex-col items-center">
                            <p>{t('game.team')} 1</p>
                            <p>{t('game.points')}: {game?.teams[0].points}</p>
                            <p>{t('game.eyes')}: {game?.teams[0].eyes}</p>
                        </div>
                        <div className="flex justify-center flex-col items-center">
                            <p>{t('game.team')} 2</p>
                            <p>{t('game.points')}: {game?.teams[1].points}</p>
                            <p>{t('game.eyes')}: {game?.teams[1].eyes}</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center flex-col md:text-base text-[14px] z-[100]">
                    <p
                        style={game?.turn === gameUsers[1]?.turn
                            ? {color: 'green', fontWeight: 'bold'}
                            : {}
                        }
                    >
                        {gameUsers[1]?.nickname}
                    </p>
                    { gameUsers[1]?.cards.length !== 0
                        ? (
                            <div className="flex justify-center items-center flex-row md:w-[80px] md:h-[120px] w-[60px] h-[80px]">
                                {
                                    gameUsers[1]?.cards.map((card, index) => {
                                        return (
                                            <img id={`card_${card.id}`} key={`card_${card.id}`} className="md:w-[80px] md:h-[120px] w-[60px] h-[80px] absolute flex justify-center z-[101] items-center" src={require('../../assets/backsideCard.png')} style={{marginRight: 4*index}}/>
                                        )
                                    })
                                }
                            </div>
                            
                        ) : 
                        ( dealerNickname()?.nickname === gameUsers[1].nickname &&
                            <CardsToDeal tableCards={tableCards}/>
                        )
                    }
                </div>
            </div>
            <div className="absolute top-[25%] min-h-[50%] max-h-[50%] w-full bg-red-100 flex justify-between items-center flex-row px-2">
                <div id={'player_2'} className="flex justify-center flex-col items-center w-[12.5%] md:w-1/4 xl:w-1/4  z-[101] md:text-base text-[14px]">
                    { gameUsers[0]?.cards.length !== 0
                        ? (
                            <div className="flex justify-center items-center flex-row md:w-[80px] md:h-[120px] w-[60px] h-[80px]">
                                {
                                    gameUsers[0]?.cards.map((card, index) => {
                                        return (
                                            <img id={`card_${card.id}`} key={`card_${card.id}`} className="md:w-[80px] md:h-[120px] w-[60px] h-[80px] absolute flex justify-center items-center" src={require('../../assets/backsideCard.png')} style={{marginLeft: -4*index}}/>
                                        )
                                    })
                                }
                            </div>
                        ) :
                        ( dealerNickname()?.nickname === gameUsers[0].nickname &&
                            <CardsToDeal tableCards={tableCards}/>
                        )
                    }
                    <p
                        style={game?.turn === gameUsers[0]?.turn
                            ? {color: 'green', fontWeight: 'bold'}
                            : {}
                    }
                    > 
                        {gameUsers[0]?.nickname}
                    </p>
                </div>
                {/* field */}
                <div id="table" className="w-[75%] md:w-1/2 xl:w-1/2 flex flex-col gap-1 justify-center items-center md:text-base text-[12px]">
                    {game?.turn === game?.users.filter(v => v.nickname === user.nickname)[0].turn
                        ? (   
                            <div className="w-full flex justify-center">
                                <p>{t('game.turn')}</p>
                            </div>
                        ) : <p>{t('game.noTurn')}</p>
                    }  
                    {game?.trump === '' && game.turn === game.users.filter(v => v.nickname === user.nickname)[0].turn && game?.users.filter(v => v.nickname === user.nickname)[0].cards.length! > 0
                        && <ChooseTrump onSubmit={chooseTrumpSubmit} isLast={isLastTrumped}/>
                    }
                    {
                        game?.turn === 1 && game?.users.filter(v => v.nickname === user.nickname)[0].turn === 1 && game.trump === '' && game?.users.filter(v => v.nickname === user.nickname)[0].cards.length! === 0 && isDeal
                        ? (
                            <ChooseDeal onSubmit={chooseDealSubmit}/>
                        ) : null
                    }
                    <div className="flex flex-row justify-center items-center w-full md:ml-[40px] ml-[30px]">
                        <TableCards cards={game?.round.cards}/>
                    </div>
                </div>
                <div id={'player_3'} className="flex justify-center items-center flex-col w-[12.5%] md:w-1/4 xl:w-1/4 z-[101] md:text-base text-[14px]"> 
                    { gameUsers[2]?.cards.length !== 0
                        ? (
                            <div className="flex justify-center items-center flex-row md:w-[80px] md:h-[120px] w-[60px] h-[80px]">
                                {
                                    gameUsers[2]?.cards.map((card, index) => {
                                        return (
                                            <img id={`card_${card.id}`} key={`card_${card.id}`} className="md:w-[80px] md:h-[120px] w-[60px] h-[80px] absolute flex justify-center items-center" src={require('../../assets/backsideCard.png')} style={{marginRight: 4*index}}/>
                                        )
                                    })
                                }
                            </div>
                        ) : 
                        ( dealerNickname()?.nickname === gameUsers[2].nickname &&
                            <CardsToDeal tableCards={tableCards}/>
                        )
                    }
                    <p
                        style={game?.turn === gameUsers[2]?.turn
                            ? {color: 'green', fontWeight: 'bold'}
                            : {}
                    }
                    >
                        {gameUsers[2]?.nickname}
                    </p>
                </div>
            </div>
            <div id={'player_4'} className="absolute top-[75%] min-h-[25%] max-h-[25%] w-full bg-green-100 flex justify-between items-center flex-col gap-2 px-2">
                <div className="flex flex-col justify-start items-center w-full mt-4 gap-2 md:text-base text-[14px]">
                    <div className="flex flex-row justify-center items-center w-full gap-1 z-[101] md:ml-[40px] ml-[30px]">
                        {game?.users.filter(v => v.nickname === user.nickname)[0].cards.map((card, index) => {
                            return (
                                <button id={`card_${card.id}`} key={`card_${card.id}`} onClick={() => drawCard(card)} disabled={disableTurn  } className="md:-ml-[40px] -ml-[30px] md:text-[16px] text-[12px] flex flex-col md:w-[80px] md:h-[120px] w-[60px] h-[80px] gap-1 rounded-[6px] bg-white border-[1px] border-black items-between justify-between hover:-translate-y-4 transition-transform" style={{zIndex: 50+index}}>
                                    <div className="flex flex-row items-center gap-1 pl-1">
                                        <p>{card.value}</p>
                                        <CardIco suit={card.suit}/>
                                    </div>
                                    <div className="flex flex-row items-center gap-1 pl-1 rotate-180">
                                        <p>{card.value}</p>
                                        <CardIco suit={card.suit}/>
                                    </div>
                                </button>
                            )
                        })}
                        {( dealerNickname()?.nickname === user.nickname &&
                            <CardsToDeal tableCards={tableCards}/>
                        )}
                    </div>
                    <p style={game?.turn === game?.users.filter(v => v.nickname === user.nickname)[0].turn ? {color: 'green', fontWeight: 'bold'} : {}}>
                        {game?.users.filter(v => v.nickname === user.nickname)[0].nickname} ({t('game.team')} {game?.users.filter(v => v.nickname === user.nickname)[0].teamId})
                    </p>
                    {game?.users[0].nickname === user.nickname && <button onClick={resetGame} className="bg-orange-500 p-2 text-[10px] absolute right-4 bottom-8">Reset game</button>}
                </div>
                <div className="w-full flex justify-center flex-col items-center overflow-hidden">
                    <div className="overflow-scroll scroll-[rgba(0,0,0,0)] w-full max-h-4 md:max-h-8 sm:max-h-4 flex flex-col justify-center items-center gap-[2px]">
                        {messages.map((message, index) => {
                            return (
                                <p className="text-[11px]" key={index}>{message}</p>
                            )
                        })}
                        <div ref={messagesEndRef}/>
                    </div>
                </div>
            </div>
        </main>
    );
}