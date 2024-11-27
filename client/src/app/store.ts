import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import websocketReducer from "./features/websocketSlice";
import lobbyReducer from "./features/lobbySlice";
import lobbyUsersReducer from "./features/lobbyUsersSlice";
import languageReducer from './features/languageSlice';
import gameReducer from './features/gameSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    game: gameReducer,
    language: languageReducer,
    lobby: lobbyReducer,
    lobbyUsers: lobbyUsersReducer,
    ws: websocketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
