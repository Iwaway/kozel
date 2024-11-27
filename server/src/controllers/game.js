const Deck = require('./deck');
const deck = new Deck();
const utils = require("../utils/utils");

const trumped = {};

class Game{
    actions = {
        initGame: (ws, { teammateNickname }, lobby, games) => {
            const gameId = utils.getLobbyId();

            const lobbyUsers = lobby.users;

            const firstTeam = lobbyUsers.filter(v => (v.nickname === teammateNickname || v.isLeader));
            const secondTeam = lobbyUsers.filter(v => (v.nickname !== teammateNickname && !v.isLeader));

            games['game#'+gameId] = {
                gameId: gameId,
                users: [
                    {ws: firstTeam[0].ws, nickname: firstTeam[0].nickname, turn: 1, cards: [], teamId: 1},
                    {ws: secondTeam[0].ws, nickname: secondTeam[0].nickname, turn: 2, cards: [], teamId: 2},
                    {ws: firstTeam[1].ws, nickname: firstTeam[1].nickname, turn: 3, cards: [], teamId: 1},
                    {ws: secondTeam[1].ws, nickname: secondTeam[1].nickname, turn: 4, cards: [], teamId: 2},
                ],
                teams: [
                    {teamId: 1, points: 0, trumped: false, isLast: false, eyes: 0},
                    {teamId: 2, points: 0, trumped: false, isLast: false, eyes: 0},
                ],
                round: {
                    suit: null,
                    cards: [],
                },
                trump: '',
                turn: 1,
                turnN: 0,
                isEgg: false,
            };

            trumped[gameId] = {
                users: [],
            };

            const game = games['game#'+gameId];

            // this.actions.drawCards(game);

            const res = {route: 'initGame', status: 'ok', data: {game}};
            console.log("#res:", res);

            lobby.users.forEach(user => {
                user.ws.send(JSON.stringify(res));
            });
        },

        decideDeal: (ws, {gameId, deal}, lobby, games) => {
            const game = games['game#'+gameId];
            var message = {};

            message = {
                keys: ['game.pickDeal', `game.deals.${deal}`],
                values: {
                    nickname: game.users.filter(v => v.turn === 1)[0].nickname,
                }
            }

            this.actions.drawCards(game, deal);

            const res = {route: 'updateGame', status: 'ok', deal: deal, isDeal: true, data: {game, message}};
            console.log("#res:", res);

            game.users.forEach((user) => {
                user.ws.send(JSON.stringify(res));
            });
        },

        resetGame: (ws, {gameId}, lobby, games) => {
            const game = games['game#'+gameId];

            game.teams.forEach((team) => {
                team.points = 0;
                team.trumped = false;
                team.isLast = false;
                team.eyes = 0;
            });

            // this.actions.drawCards(game);

            const res = {route: 'updateGame', status: 'ok', data: {game}};
            console.log("#res:", res);

            game.users.forEach((user) => {
                user.ws.send(JSON.stringify(res));
            });
        },

        drawCards: (game, deal) => {
            const gameDeck = deck.getDeck();
            deck.shuffle(gameDeck);

            if (deal === 'all') {
                const subDecks = deck.sliceIntoSubDecks(gameDeck, 8);

                subDecks.forEach((subDeck, index) => {
                    if (deck.getCardsPoints(subDeck) < 5) {
                        this.actions.drawCards(game);
                    }
                });
    
                game.users.forEach((user, index) => {
                    user.cards = subDecks[index];
                });
            } else {
                const dealedCards = deck.dealCards(gameDeck, deal, game.users);

                game.users.forEach((user, index) => {
                    user.cards = dealedCards.userCards[index];

                    const dealNickname = game.users.filter(v => v.turn === (index+1))[0].nickname;

                    dealedCards.roundCards[index].forEach((card) => {
                        game.round.cards.push({nickname: dealNickname, card: card});
                    });
                });
            }
        },

        decideTurn: (ws, {gameId, firstTurnNickname}, lobbies, games) => {
            const game = games['game#'+gameId];
            game.users.filter(v => v.nickname === firstTurnNickname)[0].turn = 1;
            const firstIndex = game.users.findIndex(v => v.nickname === firstTurnNickname);
            let i = firstIndex;
            let turn = 1;

            for (let index = 1; index < game.users.length; index++) {
                try {
                    i += 1;
                    turn += 1;
                    game.users[i].turn = turn;
                } catch (e) {
                    game.users[i - game.users.length].turn = turn;
                }
            }
        },

        makeTurn: (ws, {gameId, nickname, card}, lobbies, games) => {
            const game = games['game#'+gameId];
            const gameUser = game.users.filter(v => v.nickname === nickname)[0];
            const round = game.round;
            let suitCards = [];

            if (round.suit === game.trump) {
                suitCards = gameUser.cards.filter(v => v.suit === round.suit || v.value === 'J');
            } else {
                suitCards = gameUser.cards.filter(v => v.suit === round.suit && v.value !== 'J');
            }
            
            console.log('suitCard:', suitCards);
            var message = {};
            var roundCard = {};

            if (round.cards.length === 0) {
                if (card.value === 'J') {
                    round.suit = game.trump;
                } else {
                    round.suit = card.suit;
                };
                const newCards = gameUser.cards.filter(v => v.id !== card.id);
                gameUser.cards = newCards;
                round.cards.push({nickname: nickname, card: card});
                message = {
                    keys: ['game.drawCard', `game.trumps.${card.suit}`],
                    values: {
                        nickname: nickname,
                        cardValue: card.value,
                    },
                };
                roundCard = card;
            } else {
                if (card.suit === round.suit || suitCards.length === 0 || (round.suit === game.trump && card.value === 'J')) {
                    const newCards = gameUser.cards.filter(v => v.id !== card.id);
                    gameUser.cards = newCards;
                    round.cards.push({nickname: nickname, card: card});
                    message = {
                        keys: ['game.drawCard', `game.trumps.${card.suit}`],
                        values: {
                            nickname: nickname,
                            cardValue: card.value,
                        },
                    };
                    roundCard = card;
                } else {
                    message = {
                        keys: round.suit === game.trump ? [`game.notDrawCardJack`, `game.trumps.${round.suit}`] : [`game.notDrawCard`, `game.trumps.${round.suit}`],
                        values: {
                            suit: round.suit,
                        },
                    };

                    const res = {route: 'updateGame', status: 'error', data: {message}};
                    console.log("#res:", res);
                    ws.send(JSON.stringify(res));
                    return false;
                }
            };

            if (game.turn !== 4) {
                game.turn = game.turn + 1;
            } else {
                game.turn = 1;
                const res = {route: 'updateGame', status: 'ok', makeTurn: true, card: roundCard, data: {game, message}};

                game.users.forEach((user) => {
                    user.ws.send(JSON.stringify(res));
                });

                const winMessage = this.actions.decideRoundWinner(ws, {gameId}, lobbies, games);
                message = winMessage;

                setTimeout(() => {
                    const res = {route: 'updateGame', status: 'ok', makeTurn: true, card: roundCard, data: {game, message}};
                    console.log("#res:", res);
        
                    game.users.forEach((user) => {
                        user.ws.send(JSON.stringify(res));
                    });
        
                    if (game.users.filter(v => v.cards.length === 0).length === 4) {
                        this.actions.decideTurnWinner(ws, {gameId}, lobbies, games);
                    }
                }, 1500);
                return;
            }

            const res = {route: 'updateGame', status: 'ok', makeTurn: true, card: roundCard, data: {game, message}};
            console.log("#res:", res);

            game.users.forEach((user) => {
                user.ws.send(JSON.stringify(res));
            });

            if (game.users.filter(v => v.cards.length === 0).length === 4) {
                this.actions.decideTurnWinner(ws, {gameId}, lobbies, games);
            }
        },
        proposeTrump: (ws, {gameId, trump, cards}, lobbies, games) => {
            const game = games['game#'+gameId];
            const nickname = game.users.filter(v => v.ws === ws)[0].nickname;
            var message = {};

            if (trump !== '') {
                const trumpCards = cards.filter(v => v.suit === trump || v.value === 'J');
                const side = cards.length - trumpCards.length;
                const isAce = trumpCards.filter(v => v.value === 'A').length === 1 ? true : false;

                trumpCards.sort(function(a,b) {
                    return a.power - b.power;
                });
    
                trumped[gameId].users.push({nickname: nickname, trump: trump, side: side, isAce: isAce, trumpCards: trumpCards});
                message = {
                    keys: ['game.pickTrump'],
                    values: {
                        nickname: nickname,
                        side: side,
                    },
                };
            } else {
                message = {
                    keys: ['game.passTrump'],
                    values: {
                        nickname: nickname,
                    },
                };
            }

            const trumpLength = trumped[gameId].users.length;

            if (game.turn !== 4) {
                game.turn = game.turn + 1;
            } else {
                if (trumpLength && trumpLength === 1 && trumped[gameId].users[0].nickname === nickname) {
                    message = '';
                }
            }

            const res = {route: 'proposeTrump', status: 'ok', data: {game, trumpLength, message}};
            console.log("#res:", res);

            game.users.forEach((user) => {
                user.ws.send(JSON.stringify(res));
            });

            if (game.turn === 4 && game.users.filter(v => v.nickname === nickname)[0].turn === 4) {
                this.actions.decideTrump(ws, gameId, lobbies, games);
            }
        },
    }
    getMessage(ws, route, lobbyId, data, lobbies, games){
        const lobby = lobbies['lobby#'+lobbyId];
        console.log(lobbyId, lobby);
        if(this.actions[route]) this.actions[route](ws, data, lobby, games);
    }
}

module.exports = Game;