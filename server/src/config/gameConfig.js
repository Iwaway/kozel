var suits = ["spades", "diamonds", "clubs", "hearts"];
var values = ["7", "8", "9", "J", "Q", "K", "10", "A"];

function getDeck() {
	let deck = new Array();

	for(let i = 0; i < suits.length; i++) {
		for(let x = 0; x < values.length; x++) {
			let card = {Value: values[x], Suit: suits[i], Power: x};
			deck.push(card);
		}
	}

	return deck;
};

function shuffle(deck) {
	for (let i = 0; i < 1000; i++) {
		let location1 = Math.floor((Math.random() * deck.length));
		let location2 = Math.floor((Math.random() * deck.length));
		let tmp = deck[location1];

		deck[location1] = deck[location2];
		deck[location2] = tmp;
	}
}