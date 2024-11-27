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

        decideTrump: (ws, gameId, lobbies, games) => {
            const trumps = trumped[gameId];
            console.log(trumps);

            if (trumps.users.length === 1) {
                this.actions.pickTrump(ws, {gameId, nickname: trumps.users[0].nickname, trump: trumps.users[0].trump}, lobbies, games);
            } else {
                const minSide = Math.min(...trumps.users.map(v => v.side));
                const allMinSides = trumps.users.filter(v => v.side === minSide);
                console.log(minSide, allMinSides);

                if (allMinSides.length === 1) {
                    this.actions.pickTrump(ws, {gameId, nickname: allMinSides[0].nickname, trump: allMinSides[0].trump}, lobbies, games);
                } else {
                    const acedTrumps = trumps.users.filter(v => v.isAce === true);
                    console.log(acedTrumps);

                    if (acedTrumps.length === 1) {
                        this.actions.pickTrump(ws, {gameId, nickname: acedTrumps[0].nickname, trump: acedTrumps[0].trump}, lobbies, games);
                    } else {
                        for (let index = 0; index < trumps.users[0].trumpCards.length; index++) {
                            let powers = [];
                            trumps.users.forEach((user) => {
                                powers.push({nickname: user.nickname, power: user.trumpCards[index].power, trump: user.trump});
                            });
                            const maxPower = Math.max(...powers.map(v => v.power));
                            const allMaxPowers = powers.filter(v => v.power === maxPower);

                            if (allMaxPowers.length === 1) {
                                this.actions.pickTrump(ws, {gameId, nickname: allMaxPowers[0].nickname, trump: allMaxPowers[0].trump}, lobbies, games);
                                break;
                            }
                        }
                    }
                }
            };
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

        pickTrump: (ws, {gameId, nickname, trump}, lobbies, games) => {
            const game = games['game#'+gameId];
            const teamId = game.users.filter(v => v.nickname === nickname)[0].teamId;
            const team = game.teams.filter(v => v.teamId === teamId)[0];
            var message = {};

            message = {
                keys: ['game.pickTrumpRes', `game.trumps.${trump}`],
                values: {
                    nickname: nickname,
                },
            };

            game.trump = trump;
            game.turn = 1;

            if(trumped[gameId].users.length === 1 && game.users.filter(v => v.nickname === nickname)[0].turn === 4) {
                team.isLast = true;
                console.log("Prinuda:", team.teamId, team.isLast.toString());
            };

            trumped[gameId].users = [];

            team.trumped = true;

            this.actions.decideTurn(ws, {gameId: gameId, firstTurnNickname: nickname}, lobbies, games);

            if (game.round.cards.length > 0) {
                this.actions.calculateAfterDeal(game);
                setTimeout(() => {
                    const res = {route: 'updateGame', status: 'ok', data: {game, message}};
                    console.log("#res:", res);
        
                    game.users.forEach((user) => {
                        user.ws.send(JSON.stringify(res));
                    });
                }, 1200);
                return;
            }

            const res = {route: 'updateGame', status: 'ok', data: {game, message}};
            console.log("#res:", res);

            game.users.forEach((user) => {
                user.ws.send(JSON.stringify(res));
            });
        },

        calculateAfterDeal: (game) => {
            const tableCards = game.round.cards;
            const roundsN = tableCards.length/game.users.length;

            for (let index = 0; index < roundsN; index++) {
                let roundCards = [];
                game.users.forEach((user) => {
                    roundCards.push(tableCards.filter(v => v.nickname === user.nickname)[index].card);
                });

                const roundSuit = roundCards[0].suit;

                const theStrongestCardId = deck.getTheStrongestCardId(roundCards, roundSuit, roundSuit);
                const winnerNickname = tableCards.filter(v => v.card.id === theStrongestCardId)[0].nickname;
                const winnerTeamId = game.users.filter(v => v.nickname === winnerNickname)[0].teamId;
    
                const points = deck.getCardsPoints(roundCards);
                const winnerTeam = game.teams.filter(v => v.teamId === winnerTeamId)[0];
                winnerTeam.points += points;
            }

            game.round = {
                suit: null,
                cards: [],
            };

            var message = {
                keys: ['game.dealResult'],
                values: {
                    team1points: game.teams[0].points,
                    team2points: game.teams[1].points,
                }
            };

            const res = {route: 'updateGame', status: 'ok', data: {game, message}};
            console.log("#res:", res);

            game.users.forEach((user) => {
                user.ws.send(JSON.stringify(res));
            });
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

        decideRoundWinner: (ws, {gameId}, lobbies, games) => {
            const game = games['game#'+gameId];
            const round = game.round;
            const roundCards = round.cards.map(v => v.card);

            const theStrongestCardId = deck.getTheStrongestCardId(roundCards, game.trump, game.round.suit);
            const winnerNickname = round.cards.filter(v => v.card.id === theStrongestCardId)[0].nickname;
            const winnerTeamId = game.users.filter(v => v.nickname === winnerNickname)[0].teamId;

            const points = deck.getCardsPoints(roundCards);
            const winnerTeam = game.teams.filter(v => v.teamId === winnerTeamId)[0];
            winnerTeam.points += points;

            game.round = {
                suit: null,
                cards: [],
            };

            this.actions.decideTurn(ws, {gameId, firstTurnNickname: winnerNickname}, lobbies, games);

            const message = {
                keys: ['game.winRound'],
                values: {
                    nickname: winnerNickname,
                    team: winnerTeamId,
                    points: points,
                },
            };

            return message;
        },

        decideTurnWinner: (ws, {gameId}, lobbies, games) => {
            const game = games['game#'+gameId];

            const winnerTeam = game.teams.filter(v => v.points >= 60)[0];

            let eyes = 0;
            console.log(winnerTeam.trumped.toString(), game.teams.filter(v => v.teamId !== winnerTeam.teamId)[0].isLast.toString());
            if (winnerTeam.points === 60) {
                game.isEgg = true;
            } else if (!winnerTeam.trumped && !game.teams.filter(v => v.teamId !== winnerTeam.teamId)[0].isLast) {
                eyes += game.isEgg ? 2 : 1;
            }

            if (winnerTeam.points === 120) {
                eyes += game.isEgg ? 12 : 6;
            } else if (winnerTeam.points > 90) {
                eyes += game.isEgg ? 8 : 4;
            } else if (winnerTeam.points > 60) {
                eyes += game.isEgg ? 4 : 2;
            }

            if (game.isEgg && eyes > 0) {
                game.isEgg = false;
            }

            let message = {};

            if (game.isEgg) {
                message = {
                    keys: ['game.eggs'],
                    values: {},
                };
            } else {
                message = {
                    keys: ['game.winTurn'],
                    values: {
                        team: winnerTeam.teamId,
                        points: winnerTeam.points,
                        eyes: eyes,
                    },
                };
            }

            game.teams.forEach((team) => {
                team.points = 0;
                team.trumped = false;
                team.isLast = false;
            });

            let turn = 1;

            game.users.forEach((user) => {
                user.turn = turn;
                turn += 1;
            });

            game.trump = '';
            game.turn = 1;

            game.turnN += 1;

            const newTurn = game.turnN % 4;
            const firstTurnNickname = game.users[newTurn].nickname;
            this.actions.decideTurn(ws, {gameId, firstTurnNickname}, lobbies, games);

            if (game.teams.filter(v => v.teamId !== winnerTeam.teamId)[0].eyes + eyes >= 12) {
                message = {
                    keys: ['game.winGame'],
                    values: {
                        team: winnerTeam.teamId,
                    },
                };
                
                this.actions.endGame(game, winnerTeam);
                return
            } else {
                game.teams.filter(v => v.teamId !== winnerTeam.teamId)[0].eyes += eyes;
            }

            const res = {route: 'updateGame', status: 'ok', data: {game, message: message}};
            console.log(message);
            console.log("#res:", res);

            // this.actions.drawCards(game);

            setTimeout(() => {
                game.users.forEach((user) => {
                    user.ws.send(JSON.stringify(res));
                });
            }, 1200);
        },

        endGame: (game, winnerTeam) => {
            const res = {route: 'endGame', status: 'ok', data: {game, winnerTeam}};
            console.log('#res:', res);

            game.users.forEach((user) => {
                user.ws.send(JSON.stringify(res));
            });
        },

        closeGame: (ws, {gameId}, lobby, games) => {
            const game = games['game#'+gameId];

            const res = {route: 'closeGame', status: 'ok', data: {}};
            console.log('#res:', res);

            game.users.forEach((user) => {
                user.ws.send(JSON.stringify(res));
            });

            delete games['game#'+gameId];
        }
    }
    getMessage(ws, route, lobbyId, data, lobbies, games){
        const lobby = lobbies['lobby#'+lobbyId];
        console.log(lobbyId, lobby);
        if(this.actions[route]) this.actions[route](ws, data, lobby, games);
    }
}

module.exports = Game;