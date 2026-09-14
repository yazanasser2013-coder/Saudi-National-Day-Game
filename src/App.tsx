import { GameProvider } from "./context/GameContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingScreen } from "./components/LandingScreen";
import { PlayerJoin } from "./components/PlayerJoin";
import { GameShell } from "./components/GameShell";

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingScreen />} />
          <Route path="/join" element={<PlayerJoin />} />
          <Route path="/game" element={<GameShell />} />
          <Route path="/ready" element={<GameShell />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
