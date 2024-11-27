import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { useDispatch } from "react-redux";
import { setWebSocket } from "./app/features/websocketSlice";
import { Lobby } from "./pages/Lobby";
import { store } from "./app/store";
import { Settings } from "./pages/Settings";
import { Game } from "./pages/Game";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const ws = store.getState().ws.webSocket;

  const connectSocket = async () => {
    const ws = new WebSocket('ws://localhost:80');

    ws.onopen = () => {
      console.log('WebSocket connection established.');
    };

    dispatch(setWebSocket(ws));
  };

  useEffect(() => {
    connectSocket();
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [ws]);

  return (
    <div>
    {!loading ?
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home/>} />
            <Route path="login" element={<Login/>} />
            <Route path="lobby" element={<Lobby/>} />
            <Route path="settings" element={<Settings/>} />
            <Route path="game" element={<Game/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    : (
      <div className="absolute w-full h-full flex justify-center items-center flex-col">
        <p>Loading...</p>
        <img width={100} height={100} src={require('./assets/loading.gif')} alt='loading...'/>
      </div>
    )
    }
    </div>
    );
}
export default App;