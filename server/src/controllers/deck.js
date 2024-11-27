const gameConstants = require('../constants');

class Deck{
    getDeck() {
        let deck = new Array();
        let id = 0;
    
        for(let i = 0; i < gameConstants.CARD_SUITS.length; i++) {
            for(let x = 0; x < gameConstants.CARD_VALUES.length; x++) {
                let card = {id: id, value: gameConstants.CARD_VALUES[x], suit: gameConstants.CARD_SUITS[i], power: gameConstants.CARD_VALUES[x] === 'J' ? x+i : x};
                deck.push(card);
                id++;
            }
        }

        console.log(deck);
    
        return deck;
    };
    
    shuffle(deck) {
        for (let i = 0; i < 1000; i++) {
            let location1 = Math.floor((Math.random() * deck.length));
            let location2 = Math.floor((Math.random() * deck.length));
            let tmp = deck[location1];
    
            deck[location1] = deck[location2];
            deck[location2] = tmp;
        }
    };

    sliceIntoSubDecks(deck, chunkSize) {
        const res = [];
        for (let i = 0; i < deck.length; i += chunkSize) {
            const chunk = deck.slice(i, i + chunkSize);
            chunk.sort(function(a,b) {
                var x = a.suit.toLowerCase();
                var y = b.suit.toLowerCase();
                var x1 = a.value;
                var y1 = b.value;
                if (x1 === 'J') return -1;
                if (y1 === 'J') return 1;
                return x < y ? -1 : x > y ? 1 : 0;
            });
            res.push(chunk);
        }
        return res;
    };

    dealCards(deck, cardsDeal, users) {

        const usersCount = users.length;

        var result = {};
        let dealCards = [];
        let handCards = [];
        let userCards = [];
        let roundCards = [];

        switch (cardsDeal) {
            case 'pants':
                dealCards = deck.slice(0, usersCount*2);
                handCards = deck.slice(usersCount*2);
                userCards = this.sliceIntoSubDecks(handCards, handCards.length/usersCount);
                roundCards = this.sliceIntoSubDecks(dealCards, 2);
                result = {
                    roundCards: roundCards,
                    userCards: userCards,
                }
                return result;
            case 'one':
                dealCards = deck.slice(0, usersCount);
                handCards = deck.slice(usersCount);
                userCards = this.sliceIntoSubDecks(handCards, handCards.length/usersCount);
                roundCards = this.sliceIntoSubDecks(dealCards, 1);
                result = {
                    roundCards: roundCards,
                    userCards: userCards,
                }
                return result;
            case 'satellite':
                dealCards = deck.slice(0, usersCount*6);
                handCards = deck.slice(usersCount*6);
                userCards = this.sliceIntoSubDecks(handCards, handCards.length/usersCount);
                roundCards = this.sliceIntoSubDecks(dealCards, 6);
                result = {
                    roundCards: roundCards,
                    userCards: userCards,
                }
                return result;
            default:
                break;
        }
    }

    getTheStrongestCardId(cards, trump, roundSuit) {
        console.log(cards);
        const activeCards = cards.filter(v => v.suit === roundSuit || v.suit === trump || v.value === 'J');
        const trumps = activeCards.filter(v => v.suit === trump || v.value === 'J');
        var theStrongestCardId = -1;

        if (trumps.length > 0) {
            const maxPower = Math.max(...trumps.map(v => v.power));
            console.log(trumps, maxPower);
            theStrongestCardId = trumps.filter(v => v.power === maxPower)[0].id;
        } else {
            const maxPower = Math.max(...activeCards.map(v => v.power));
            console.log(activeCards, maxPower);
            theStrongestCardId = activeCards.filter(v => v.power === maxPower)[0].id;
        }

        return theStrongestCardId;
    };

    getCardCost(card) {
        switch (card.value) {
            case '7':
                return 0;
            case '8':
                return 0;
            case '9':
                return 0;
            case 'J':
                return 2;
            case 'Q':
                return 3;
            case 'K':
                return 4;
            case '10':
                return 10;
            case 'A':
                return 11;
            default:
                return 0;
        }
    };

    getCardsPoints(cards) {
        let points = 0;

        cards.forEach(card => {
            const cardCost = this.getCardCost(card);
            points += cardCost;
        });

        return points;
    }
}

module.exports = Deck;