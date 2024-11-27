import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { CardSuits, Deals } from "../../enums/gameCardEnums";
import { useEffect, useRef, useState } from "react";
import { setGame } from "../../app/features/gameSlice";
import { useUtils } from "../../utils/useUtils";
import { GameCard, GameUser, Team, UserCard } from "../../interfaces/game";
import { useTranslation } from "react-i18next";
import { Dictionary, round } from "lodash";


export function useGame() {

    const dispatch = useDispatch();
    const { navigateTo, dealTimeot, randomIntFromInterval } = useUtils();
    const { t } = useTranslation();

    const ws = useSelector((state: RootState) => state.ws.webSocket);
    const game = useSelector((state: RootState) => state.game.game);
    const user = useSelector((state: RootState) => state.user);
    const lobbyId = useSelector((state: RootState) => state.lobby.lobbyId);

    const [isLastTrumped, setIsLastTrumped] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [messages, setMessages] = useState<string[]>([]);
    const [gameUsers, setGameUsers] = useState<GameUser[]>([]);
    const [gameMessage, setGameMessage] = useState<string | undefined>();
    const [disableTurn, setDisableTurn] = useState(false);
    const [endGameModal, setEndGameModal] = useState(false);
    const [winnerTeam, setWinnerTeam] = useState<Team>();
    const [isDeal, setIsDeal] = useState(true);
    const [tableCards, setTableCards] = useState<UserCard[]>([]);
    
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    var timeOut: NodeJS.Timeout;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    };

    useEffect(() => {
        if (!user.token) {
            navigateTo('/login');
        }

        if (ws && ws.readyState === 1) {
            ws.addEventListener('message', (event) => {
                const res = JSON.parse(event.data);
                if (res.data.message) {
                    const values = res.data.message.values as Dictionary<string>;
                    var messageText = '';
                    res.data.message.keys.forEach((key: string, index: number) => {
                        messageText += index > 0 ? t(key, values).toLowerCase() + ' ' : t(key, values) + ' ';
                    });
                    showMessage(messageText, res.status === 'ok' ? 'game' : 'error');
                    setMessages(state => ([...state, messageText]));
                }
                switch (res.route) {
                    case 'initGame':
                        if (res.status === 'ok') {
                            dispatch(setGame({game: res.data.game}));
                        }
                        break;
                    case 'proposeTrump':
                        if (res.status === 'ok') {
                            if (res.data.trumpLength === 0 && res.data.game.turn === 4 && res.data.game.users.filter((v: GameUser) => v.nickname === user.nickname)[0].turn === 4) {
                                setIsLastTrumped(true);
                                console.log('last trumped true!');
                            } else {
                                setIsLastTrumped(false);
                            }
                            dispatch(setGame({game: res.data.game}));
                        } else {
                            const messageError = res.data.message;
                            console.log(messageError);
                        }
                        break;
                    case 'updateGame':
                        if (res.status === 'ok') {
                            console.log('updateGame');
                            setErrorMessage('');
                            setEndGameModal(false);
                            if (res.makeTurn) {
                                drawCardToTableAnimation(`card_${res.card.id}`);
                                setTimeout(() => {
                                    dispatch(setGame({game: res.data.game}));
                                }, 1000);
                                break;
                            } else if (res.isDeal) {
                                console.log(res.data.game.round.cards);
                                console.log('from server:', res.data.game.users as GameUser[]);
                                setTableCards(res.data.game.round.cards as UserCard[]);
                                dealCardsAnimation(res.deal, res.data.game.round.cards, res.data.game.users);
                                setTimeout(() => {
                                    dispatch(setGame({game: res.data.game}));
                                    setIsDeal(true);
                                }, dealTimeot(res.deal as Deals));
                                break;
                            } else {
                                dispatch(setGame({game: res.data.game})); 
                            }
                            
                        } else {
                            // const values = res.data.message.values as Dictionary<string>;
                            // if (values['suit']) {
                            //     const suitT = t('game.trumps.'+values['suit']).toLowerCase();
                            //     showMessage(t(res.data.message.key, values)+suitT, 'error');
                            // } else {
                            //     showMessage(t(res.data.message.key, values), 'error');
                            // }
                        }
                        break;
                    case 'endGame': {
                        if (res.status === 'ok') {
                            const winnerTeam = res.data.winnerTeam as Team;
                            dispatch(setGame({game: res.data.game}));
                            setWinnerTeam(winnerTeam);
                            setEndGameModal(true);
                        } else {
                            const messageError = res.data.message;
                            console.log(messageError);
                        }
                        break;
                    }
                    case 'closeGame': {
                        setEndGameModal(false);
                        navigateTo('/lobby');
                        break;
                    }
                    default:
                        break;
                };
            })
        }
    }, []);

    useEffect(() => {
        let gameUsers: GameUser[] = [];
        if (game) {
            const gameUser = game.users.filter(v => v.nickname === user.nickname)[0]; 
            const teammateUser = game.users.filter(v => v.nickname !== user.nickname && v.teamId === game.users.filter(v => v.nickname === user.nickname)[0].teamId)[0];
            const opponents = game.users.filter(v => v.teamId !== gameUser.teamId);
    
            if (gameUser.turn === 4) {
                const opponent1 = opponents.filter(v => v.turn === 1)[0];
                gameUsers.push(opponent1);
                gameUsers.push(teammateUser);
                gameUsers.push(opponents.filter(v => v.nickname !== opponent1.nickname)[0]);
            } else {
                const opponent1 = opponents.filter(v => v.turn === (gameUser.turn + 1))[0];
                gameUsers.push(opponent1);
                gameUsers.push(teammateUser);
                gameUsers.push(opponents.filter(v => v.nickname !== opponent1.nickname)[0]);
            }

        setGameUsers(state => gameUsers);
        }
    }, [game]);

    const showMessage = (message: string, type: 'error' | 'game') => {
        type === 'error' ? setErrorMessage(message) : setGameMessage(message);
        clearTimeout(timeOut);

        timeOut = setTimeout(() => {
            type === 'error' ? setErrorMessage(undefined) : setGameMessage(undefined);
        }, 2000);
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const drawCardToTableAnimation = (cardId: string, x?: number, y?: number) => {
        if (game) {
            var cardElement = document.getElementById(cardId);
            if (cardElement) {     
                
                const shift1 = randomIntFromInterval(1,50);
                const shift2 = randomIntFromInterval(1,50);
                const rotateShift = randomIntFromInterval(-5,5);

                const xAlt = x ? x+shift1-40 : window.innerWidth/2-40+shift1;
                const yAlt = y ? y+shift2-60 : window.innerHeight/2-60+shift2;
                const cardElemPosition = cardElement.getBoundingClientRect();
                cardElement.style.transitionDuration = '1s';
                cardElement.style.transitionTimingFunction = 'ease';
                cardElement.style.transform = `rotate(${rotateShift}deg) translate(${xAlt - cardElemPosition.x}px, ${yAlt - cardElemPosition.y}px)`;
            }
        }
    };

    const tableCardAnimation = (cards: UserCard[], deal: Deals, users: GameUser[]) => {
        if (game) {
            const cardWidth = window.innerWidth > 768 ? 80 : 60;
            const cardHeigth = window.innerHeight > 768 ? 120 : 80;
            const cardsGapX = window.innerWidth > 768 ? 64 - cardWidth/2 : 40 - cardWidth/2;
            const cardGapY = 6;
            let cardsOffset = 0;
            let cardsStart = 0;
            let cardsYStart = 0;
            switch (deal) {
                case 'one':
                    cardsOffset = (window.innerWidth/2 - (cardWidth * 2.5))/2;
                    cardsStart = cardsOffset;
                    cardsYStart = (window.innerHeight/2 - (cardHeigth*(cards.length/game.users.length/2)) - cardGapY*((cards.length/game.users.length/2)-1))/2;
                    break;
                default:
                    cardsOffset = (cardWidth * 2.5)+cardsGapX;
                    cardsStart = (window.innerWidth/2 - (cardWidth*5) - cardsGapX)/2;
                    cardsYStart = (window.innerHeight/2 - (cardHeigth*(cards.length/game.users.length/2)) - cardGapY*((cards.length/game.users.length/2)-1))/2;
                    break;
            }
            for (let i = 0; i < cards.length/game.users.length; i++) {
                for (let j = 0; j < game.users.length; j++) {
                    setTimeout(() => {
                        console.log('filter:', users.filter(v => v.turn === (j+1))[0].nickname);
                        const userNickname = users.filter(v => v.turn === (j+1))[0].nickname;
                        console.log('result:', userNickname, j+1);
                        console.log(game.users);
                        const cardId = cards.filter(v => v.nickname === userNickname)[i].card.id;
                        var cardElement = document.getElementById(`dealCard_${cardId}`);

                        const isXOffset = (i+2) % 2; 

                        if (cardElement) {
                            const x = window.innerWidth/4+cardsStart+(cardWidth/2)*j + cardsOffset*isXOffset;
                            const y = window.innerHeight/4+cardsYStart+(cardHeigth+cardGapY)*Math.floor(i/2);
                            const cardElemPosition = cardElement.getBoundingClientRect();
                            cardElement.style.zIndex = `${100+j}`;
                            cardElement.style.transitionDuration = '1s';
                            cardElement.style.transitionTimingFunction = 'ease';
                            cardElement.style.transform = `translate(${x - cardElemPosition.x}px, ${y - cardElemPosition.y}px)`;
                        }

                        if ((i === (cards.length/game.users.length - 1)) && (j === (game.users.length - 1))) {
                            var hideElement = document.getElementById('dealBackside');
                            if (hideElement) {
                                hideElement.style.display = 'none';
                            }
                        }
                    }, dealTimeot(deal)/cards.length*j+(dealTimeot(deal)/cards.length*(game.users.length))*i);
                }
            }
        }
        const openIds = cards.map((card) => {return card.card.id});
        return Array.from(Array(32).keys()).filter(v => !openIds.includes(v));
    }

    const dealCardsAnimation = (deal: Deals, cards: UserCard[], users: GameUser[]) => {
        if (game) {
            let cardsN = 0;
            let handCardsN = 0;
            switch (deal) {
                case 'all':
                    handCardsN = (32)/game.users.length;
                    break;
                case 'one':
                    cardsN = game.users.length;
                    handCardsN = (32-cardsN)/game.users.length;
                    break;
                case 'pants':
                    cardsN = game.users.length*2;
                    handCardsN = (32-cardsN)/game.users.length;
                    break;
                case 'satellite':
                    cardsN = game.users.length*6;
                    handCardsN = (32-cardsN)/game.users.length;
                    break;
                default:
                    break;
            }
            const closedIds = tableCardAnimation(cards, deal, users);
            console.log('closedIds:', closedIds);
            for (let i = 0; i < 4; i++) {
                let time = 0;
                for (let j = handCardsN*i; j < handCardsN*(i+1); j++) {
                    const playerDivPos = document.getElementById(`player_${i+1}`)?.getBoundingClientRect();
                    if (playerDivPos) {
                        const x = playerDivPos.x+playerDivPos.width/2;
                        const y = playerDivPos.y+playerDivPos.height/2;

                        setTimeout(() => {
                            drawCardToTableAnimation(`dealCard_${closedIds[j]}`, x, y);
                        }, time*55);
                        time += 1;
                    };
                };
            }
        }
    };

    const dealerNickname = () => {
        if (game && game.round.cards.length === 0) {
            let userCards: GameCard[] = [];
            game.users.map((user) => {userCards = userCards.concat(user.cards)});
            if (userCards.length === 0) {
                console.log(game.users as GameUser[]);
                return game?.users.filter(v => v.turn === 2)[0];
            }
        }
    };

    const chooseTrumpSubmit = (trump?: CardSuits) => {
        const choosedTrump = trump ? trump : '';
        if (ws && ws.readyState === 1) {
            ws.send(JSON.stringify({route: 'game', data: {route: 'proposeTrump', data: {gameId: game?.gameId, trump: choosedTrump, cards: game?.users.filter(v => v.nickname === user.nickname)[0].cards}}}));
        }
    };

    const chooseDealSubmit = (deal: Deals) => {
        if (ws && ws.readyState === 1) {
            ws.send(JSON.stringify({route: 'game', data: {route: 'decideDeal', data: {gameId: game?.gameId, deal: deal}}}));
            setIsDeal(false);
        }
    };

    const resetGame = () => {
        if (ws && ws.readyState === 1) {
            ws.send(JSON.stringify({route: 'game', data: {route: 'initGame', lobbyId: lobbyId, data: {teammateNickname: gameUsers[1].nickname}}}));
            setIsDeal(true);
        }
    };

    const drawCard = (card: GameCard) => {
        if (ws && ws.readyState === 1 && game?.trump !== '' && game?.turn === game?.users.filter(v => v.nickname === user.nickname)[0].turn) {
            ws.send(JSON.stringify({route: 'game', data: {route: 'makeTurn', data: {gameId: game?.gameId, nickname: user.nickname, card: card}}}));

            setDisableTurn(true);
            setTimeout(() => {
                setDisableTurn(false);
            }, 1200);
        } else {
            showMessage(t('game.noTurn'), 'error');
        }
    };

    return {
        game,
        user,
        ws,
        isLastTrumped,
        messages,
        errorMessage,
        messagesEndRef,
        gameMessage,
        gameUsers,
        t,
        disableTurn,
        endGameModal,
        winnerTeam,
        isDeal,
        tableCards,
        scrollToBottom,
        resetGame,
        chooseTrumpSubmit,
        drawCard,
        chooseDealSubmit,
        dealerNickname,
    };
};