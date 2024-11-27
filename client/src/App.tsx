import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(true);

  const connectSocket = async () => {
    const ws = new WebSocket('ws://localhost:80');

    ws.onopen = () => {
      console.log('WebSocket connection established.');
    };
  };

  useEffect(() => {
    connectSocket();
  }, []);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div>
    {!loading ?
      <BrowserRouter>
        <Routes>
          <Route path="/">
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