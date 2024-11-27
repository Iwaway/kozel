import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../interfaces/user";

const initialState: User = {
  id: null,
  token: null,
  nickname: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{id: string, token: string, nickname: string}>) => {
      const {id, token, nickname} = action.payload;
      return {...state,
        id: id,
        token: token,
        nickname: nickname,
      };
    },
    clearUser(state) {
      state.id = null;
      state.nickname = null;
      state.token = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
