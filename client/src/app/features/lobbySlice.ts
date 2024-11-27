import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LobbyState {
  lobbyId: string | null;
}

const initialState: LobbyState = {
    lobbyId: null,
};

const lobbySlice = createSlice({
  name: "lobby",
  initialState,
  reducers: {
    setLobby: (state, action: PayloadAction<{lobbyId: string}>) => {
        const {lobbyId} = action.payload;
        return {...state,
            lobbyId: lobbyId,
        };
    },
    clearLobby(state) {
      state.lobbyId = null;
    },
  },
});

export const { setLobby, clearLobby } = lobbySlice.actions;
export default lobbySlice.reducer;
