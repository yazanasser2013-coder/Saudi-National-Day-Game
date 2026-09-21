import {
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import type { GameState, GameAction } from "../types/game";
import { getGameQuestions } from "../data/questions";
import { calculateScore, sanitizeName } from "../utils/scoring";
import { GameContext } from "./game-context";
import { saveToLeaderboard } from "../utils/leaderboard";

const initialState: GameState = {
  player: null,
  currentQuestionIndex: 0,
  questions: [],
  phase: 1,
  timeRemaining: 0,
  score: 0,
  correctAnswers: 0,
  responseTimes: [],
  answeredQuestions: [],
  timeouts: 0,
  wrongAnswers: 0,
  fastestAnswer: Infinity,
  averageAnswerTime: 0,
  gameStatus: "landing",
  questionStartedAt: 0,
  soundEnabled: true,
  gameMode: "quiz",
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "GO_TO_JOIN": {
      return {
        ...state,
        gameStatus: "join",
      };
    }
    case "SET_PLAYER": {
      const name = sanitizeName(action.payload.name);
      const mode = action.payload.mode || "single";
      const teamNames = (action.payload.teamNames || []).map(sanitizeName);
      return {
        ...state,
        player: {
          name,
          mode,
          teamNames,
          score: 0,
          correctAnswers: 0,
          totalTime: 0,
          averageTime: 0,
          fastestAnswer: Infinity,
          responseTimes: [],
          answeredQuestions: [],
          timeouts: 0,
          wrongAnswers: 0,
        },
        gameStatus: "mode-select",
      };
    }
    case "GO_TO_MODE_SELECT": {
      return {
        ...state,
        gameStatus: "mode-select",
      };
    }
    case "SELECT_MODE": {
      const gameMode = action.payload.gameMode;
      if (gameMode === "quiz") {
        return {
          ...state,
          gameMode,
          gameStatus: "ready",
        };
      }
      return {
        ...state,
        gameMode,
        gameStatus: "playing",
      };
    }
    case "START_GAME": {
      const questions = getGameQuestions();
      return {
        ...state,
        questions,
        timeRemaining: questions[0].timeLimit,
        questionStartedAt: Date.now(),
        currentQuestionIndex: 0,
        phase: 1,
        score: 0,
        correctAnswers: 0,
        responseTimes: [],
        answeredQuestions: [],
        timeouts: 0,
        wrongAnswers: 0,
        fastestAnswer: Infinity,
        averageAnswerTime: 0,
        gameStatus: "playing",
      };
    }
    case "START_QUESTION": {
      const question = action.payload.question;
      const newPhase = question.phase as 1 | 2 | 3;
      return {
        ...state,
        phase: newPhase,
        timeRemaining: question.timeLimit,
        questionStartedAt: Date.now(),
        gameStatus:
          newPhase === 3 && state.currentQuestionIndex === 10
            ? "final-stage"
            : "playing",
      };
    }
    case "TICK_TIMER": {
      if (state.timeRemaining <= 0) return state;
      return {
        ...state,
        timeRemaining: action.payload.timeRemaining,
      };
    }
    case "ANSWER_QUESTION": {
      const { responseTime, correct, points } = action.payload;
      const currentQuestion = state.questions[state.currentQuestionIndex];
      if (
        !currentQuestion ||
        state.answeredQuestions.some((question) => question.id === currentQuestion.id)
      ) return state;
      const newResponseTimes = [...state.responseTimes, responseTime];
      const fastestAnswer = Math.min(state.fastestAnswer, responseTime);
      const averageAnswerTime =
        newResponseTimes.reduce((a, b) => a + b, 0) / newResponseTimes.length;
      const updatedPlayer = state.player
        ? {
            ...state.player,
            score: state.player.score + points,
            correctAnswers: correct
              ? state.player.correctAnswers + 1
              : state.player.correctAnswers,
            totalTime: state.player.totalTime + responseTime,
            averageTime: averageAnswerTime,
            fastestAnswer,
            responseTimes: newResponseTimes,
            answeredQuestions: [
              ...state.player.answeredQuestions,
              currentQuestion.id,
            ],
            timeouts: state.player.timeouts,
            wrongAnswers: correct
              ? state.player.wrongAnswers
              : state.player.wrongAnswers + 1,
          }
        : null;
      return {
        ...state,
        player: updatedPlayer,
        score: state.score + points,
        correctAnswers: correct
          ? state.correctAnswers + 1
          : state.correctAnswers,
        responseTimes: newResponseTimes,
        answeredQuestions: [...state.answeredQuestions, currentQuestion],
        fastestAnswer,
        averageAnswerTime,
        timeouts: correct ? state.timeouts : state.timeouts + 1,
        wrongAnswers: correct ? state.wrongAnswers : state.wrongAnswers + 1,
        timeRemaining: 0,
      };
    }
    case "TIMEOUT": {
      const currentQuestion = state.questions[state.currentQuestionIndex];
      if (
        !currentQuestion ||
        state.answeredQuestions.some((question) => question.id === currentQuestion.id)
      ) return state;
      const updatedPlayer = state.player
        ? {
            ...state.player,
            timeouts: state.player.timeouts + 1,
            answeredQuestions: [
              ...state.player.answeredQuestions,
              currentQuestion.id,
            ],
          }
        : null;
      return {
        ...state,
        player: updatedPlayer,
        answeredQuestions: [...state.answeredQuestions, currentQuestion],
        timeouts: state.timeouts + 1,
        timeRemaining: 0,
      };
    }
    case "NEXT_QUESTION": {
      const nextIndex = state.currentQuestionIndex + 1;
      if (nextIndex >= state.questions.length) {
        if (state.player) {
          saveToLeaderboard({
            name: state.player.name,
            mode: state.player.mode,
            teamNames: state.player.teamNames,
            score: state.score,
            correctAnswers: state.correctAnswers,
            totalQuestions: state.questions.length,
            averageTime: state.averageAnswerTime,
            fastestAnswer: state.fastestAnswer === Infinity ? 999 : state.fastestAnswer,
            percentage: Math.round((state.correctAnswers / state.questions.length) * 100),
            gameMode: state.gameMode,
          });
        }
        return { ...state, gameStatus: "results" };
      }
      const nextQuestion = state.questions[nextIndex];
      return {
        ...state,
        currentQuestionIndex: nextIndex,
        timeRemaining: nextQuestion.timeLimit,
        questionStartedAt: Date.now(),
      };
    }
    case "PHASE_TRANSITION":
      return { ...state, gameStatus: "phase-transition" };
    case "ENTER_FINAL_STAGE":
      return { ...state, phase: 3, gameStatus: "final-stage" };
    case "SHOW_QUESTION_20":
      return { ...state, gameStatus: "question-20" };
    case "END_GAME": {
      if (state.player) {
        saveToLeaderboard({
          name: state.player.name,
          mode: state.player.mode,
          teamNames: state.player.teamNames,
          score: state.score,
          correctAnswers: state.correctAnswers,
          totalQuestions: state.questions.length || 10,
          averageTime: state.averageAnswerTime,
          fastestAnswer: state.fastestAnswer === Infinity ? 999 : state.fastestAnswer,
          percentage: Math.round((state.correctAnswers / (state.questions.length || 10)) * 100),
          gameMode: state.gameMode,
        });
      }
      return { ...state, gameStatus: "results" };
    }
    case "RESET_GAME":
      return { ...initialState, soundEnabled: state.soundEnabled };
    case "TOGGLE_SOUND":
      return { ...state, soundEnabled: !state.soundEnabled };
    case "SET_LEADERBOARD":
      return state;
    default:
      return state;
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const answerQuestion = useCallback(
    (answerIndex: number) => {
      const currentQuestion = state.questions[state.currentQuestionIndex];
      if (!currentQuestion) return;
      const responseTime = (Date.now() - state.questionStartedAt) / 1000;
      const correct = answerIndex === currentQuestion.correctAnswer;
      const points = correct
        ? calculateScore(
            currentQuestion.basePoints,
            responseTime,
            currentQuestion.timeLimit,
          )
        : 0;
      dispatch({
        type: "ANSWER_QUESTION",
        payload: { answerIndex, responseTime, correct, points },
      });
    },
    [state.questions, state.currentQuestionIndex, state.questionStartedAt],
  );
  const startGame = useCallback(() => {
    dispatch({ type: "START_GAME" });
  }, []);
  const resetGame = useCallback(() => {
    dispatch({ type: "RESET_GAME" });
  }, []);
  const goToJoin = useCallback(() => {
    dispatch({ type: "GO_TO_JOIN" });
  }, []);
  const toggleSound = useCallback(() => {
    dispatch({ type: "TOGGLE_SOUND" });
  }, []);
  const exitGame = useCallback(() => {
    dispatch({ type: "RESET_GAME" });
  }, []);
  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        answerQuestion,
        startGame,
        resetGame,
        exitGame,
        goToJoin,
        toggleSound,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
