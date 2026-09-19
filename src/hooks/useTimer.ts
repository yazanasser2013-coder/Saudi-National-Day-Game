import { useEffect, useEffectEvent } from "react";
import { useGame } from "../context/game-context";

export function useTimer(onTimeout: () => void) {
  const { state, dispatch } = useGame();
  const currentQuestion = state.questions[state.currentQuestionIndex];
  const isAnswered = state.answeredQuestions.some(
    (question) => question.id === currentQuestion?.id,
  );
  const isPlaying =
    state.gameStatus === "playing" ||
    state.gameStatus === "final-stage" ||
    state.gameStatus === "question-20";
  const tick = useEffectEvent(() => {
    if (isAnswered || !isPlaying) return false;
    if (!currentQuestion) return false;
    const timeRemaining = Math.max(
      0,
      currentQuestion.timeLimit - (Date.now() - state.questionStartedAt) / 1000,
    );
    if (timeRemaining <= 0) {
      dispatch({ type: "TIMEOUT" });
      onTimeout();
      return false;
    }
    dispatch({ type: "TICK_TIMER", payload: { timeRemaining } });
    return true;
  });

  useEffect(() => {
    if (!isPlaying || !currentQuestion || isAnswered) return;
    const interval = window.setInterval(() => {
      if (!tick()) window.clearInterval(interval);
    }, 100);
    return () => window.clearInterval(interval);
  }, [isPlaying, currentQuestion, isAnswered, state.questionStartedAt]);
}
