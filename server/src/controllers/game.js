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
    }
    getMessage(ws, route, lobbyId, data, lobbies, games){
        const lobby = lobbies['lobby#'+lobbyId];
        console.log(lobbyId, lobby);
        if(this.actions[route]) this.actions[route](ws, data, lobby, games);
    }
}

module.exports = Game;