import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WebSocketState {
  webSocket: WebSocket | null;
}

const initialState: WebSocketState = {
  webSocket: null,
};

const webSocketSlice = createSlice({
  name: "webSocket",
  initialState,
  reducers: {
    setWebSocket(state, action: PayloadAction<WebSocket>) {
      state.webSocket = action.payload;
    },
    clearWebSocket(state) {
      state.webSocket = null;
    },
  },
});

export const { setWebSocket, clearWebSocket } = webSocketSlice.actions;

export default webSocketSlice.reducer;
