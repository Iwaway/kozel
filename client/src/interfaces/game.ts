import { CardSuits, CardValues } from "../enums/gameCardEnums";

export interface Game {
    gameId: string;
    users: GameUser[];
    teams: Team[];
    round: Round;
    trump: string;
    turn: number;
    turnN: number;
    isEgg: boolean;
}

export interface Team {
    points: number;
    teamId: number;
    trumped: boolean;
    eyes: number;
}

export interface Round {
    suit: CardSuits | null;
    cards: UserCard[];
}

export interface GameUser {
    nickname: string;
    teamId: number;
    turn: number;
    ws: WebSocket;
    cards: GameCard[];
}

export interface UserCard {
    nickname: string;
    card: GameCard;
}

export interface GameCard {
    id: number;
    value: CardValues;
    suit: CardSuits;
    power: number;
}