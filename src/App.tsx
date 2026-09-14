import { GameProvider } from "./context/GameContext";
import { GameShell } from "./components/GameShell";

function App() {
  return (
    <GameProvider>
      <GameShell />
    </GameProvider>
  );
}

export default App;
