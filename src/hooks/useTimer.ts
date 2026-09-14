import { useEffect, useRef, useCallback } from "react";
import { useGame } from "../context/GameContext";
export function useTimer() {
  const { state, dispatch } = useGame();
  const intervalRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(Date.now());
  useEffect(() => {
    if (
      state.gameStatus !== "playing" &&
      state.gameStatus !== "final-stage" &&
      state.gameStatus !== "question-20"
    ) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    if (state.timeRemaining <= 0) {
      dispatch({ type: "TIMEOUT" });
      return;
    }
    intervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const delta = (now - lastTickRef.current) / 1000;
      lastTickRef.current = now;
      dispatch({ type: "TICK_TIMER" });
      if (state.timeRemaining - delta <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        dispatch({ type: "TIMEOUT" });
      }
    }, 50);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.gameStatus, state.timeRemaining, dispatch]);
  const resetTimer = useCallback(() => {
    lastTickRef.current = Date.now();
  }, []);
  return { resetTimer };
}
