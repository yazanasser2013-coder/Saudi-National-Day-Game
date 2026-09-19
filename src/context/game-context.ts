import { createContext, useContext, type Dispatch } from "react";
import type { GameState, GameAction } from "../types/game";

export const GameContext = createContext<{
  state: GameState;
  dispatch: Dispatch<GameAction>;
  answerQuestion: (answerIndex: number) => void;
  startGame: () => void;
  resetGame: () => void;
  goToJoin: () => void;
  toggleSound: () => void;
} | null>(null);

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
}
