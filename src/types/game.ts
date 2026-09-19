export interface Question {
  id: string;
  question: string;
  answers: string[];
  correctAnswer: number;
  difficulty: "easy" | "medium" | "hard" | "extreme";
  phase: 1 | 2 | 3;
  timeLimit: number;
  basePoints: number;
  type: "multiple-choice";
}

export interface Player {
  name: string;
  score: number;
  correctAnswers: number;
  totalTime: number;
  averageTime: number;
  fastestAnswer: number;
  responseTimes: number[];
  answeredQuestions: string[];
  timeouts: number;
  wrongAnswers: number;
}

export interface GameState {
  player: Player | null;
  currentQuestionIndex: number;
  questions: Question[];
  phase: 1 | 2 | 3;
  timeRemaining: number;
  score: number;
  correctAnswers: number;
  responseTimes: number[];
  answeredQuestions: Question[];
  timeouts: number;
  wrongAnswers: number;
  fastestAnswer: number;
  averageAnswerTime: number;
  gameStatus:
    | "landing"
    | "join"
    | "ready"
    | "playing"
    | "phase-transition"
    | "final-stage"
    | "question-20"
    | "results"
    | "leaderboard";
  questionStartedAt: number;
  soundEnabled: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  correctAnswers: number;
  totalTime: number;
  averageTime: number;
}

export type GameAction =
  | { type: "GO_TO_JOIN" }
  | { type: "SET_PLAYER"; payload: { name: string } }
  | { type: "START_GAME" }
  | { type: "START_QUESTION"; payload: { question: Question } }
  | { type: "TICK_TIMER"; payload: { timeRemaining: number } }
  | {
      type: "ANSWER_QUESTION";
      payload: {
        answerIndex: number;
        responseTime: number;
        correct: boolean;
        points: number;
      };
    }
  | { type: "TIMEOUT" }
  | { type: "NEXT_QUESTION" }
  | { type: "PHASE_TRANSITION" }
  | { type: "ENTER_FINAL_STAGE" }
  | { type: "SHOW_QUESTION_20" }
  | {
      type: "END_GAME";
      payload: { rank: number; leaderboard: LeaderboardEntry[] };
    }
  | { type: "RESET_GAME" }
  | { type: "TOGGLE_SOUND" }
  | { type: "SET_LEADERBOARD"; payload: LeaderboardEntry[] };
