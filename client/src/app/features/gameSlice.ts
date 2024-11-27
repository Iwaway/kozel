import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Game } from "../../interfaces/game";

interface GameState {
  game: Game | null;
}

const initialState: GameState = {
  game: null,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setGame: (state, action: PayloadAction<{game: Game}>) => {
      state.game = action.payload.game;
    },
    clearGame: (state) => {
        state.game = null;
    }
  },
});

export const { setGame, clearGame } = gameSlice.actions;
export default gameSlice.reducer;