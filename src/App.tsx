import { HashRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import { GameShell } from "./components/GameShell";
import { CustomCursor } from "./components/CustomCursor";

function App() {
  return (
    <HashRouter>
      <GameProvider>
        <CustomCursor />
        <Routes>
          <Route path="/*" element={<GameShell />} />
        </Routes>
      </GameProvider>
    </HashRouter>
  );
}

export default App;
