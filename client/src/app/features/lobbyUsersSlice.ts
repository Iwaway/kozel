import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LobbyUser } from "../../interfaces/lobbyUser";

interface LobbyUsersState {
    users: LobbyUser[];
}

const initialState: LobbyUsersState = {
  users: [],
};

const lobbyUsersSlice = createSlice({
  name: "lobbyUsers",
  initialState,
  reducers: {
    setLobbyUsers: (state, action: PayloadAction<{users: LobbyUser[]}>) => {
        return {
            ...state,
            users: action.payload.users,
        };
    },
    clearLobbyUsers(state) {
      state.users = [];
    },
  },
});

export const { setLobbyUsers, clearLobbyUsers } = lobbyUsersSlice.actions;
export default lobbyUsersSlice.reducer;
