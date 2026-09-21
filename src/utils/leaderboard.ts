const LEADERBOARD_KEY = "saudi-natday-leaderboard";
const MAX_ENTRIES = 50;
export const OWNER_NAME = "يزن ناصر";

export interface LeaderboardEntry {
  id: string;
  name: string;
  mode: "single" | "team";
  teamNames: string[];
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  averageTime: number;
  fastestAnswer: number;
  percentage: number;
  date: string;
  timestamp: number;
  gameMode: string;
}

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as LeaderboardEntry[];
    return data.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.correctAnswers !== a.correctAnswers)
        return b.correctAnswers - a.correctAnswers;
      return a.averageTime - b.averageTime;
    });
  } catch {
    return [];
  }
}

export function saveToLeaderboard(entry: Omit<LeaderboardEntry, "id" | "date" | "timestamp">): LeaderboardEntry {
  const board = getLeaderboard();
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: crypto.randomUUID(),
    date: new Date().toLocaleDateString("ar-SA"),
    timestamp: Date.now(),
  };
  board.push(newEntry);
  board.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.correctAnswers !== a.correctAnswers)
      return b.correctAnswers - a.correctAnswers;
    return a.averageTime - b.averageTime;
  });
  const trimmed = board.slice(0, MAX_ENTRIES);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(trimmed));
  return newEntry;
}

export function getPlayerRank(
  score: number,
  correctAnswers: number,
  averageTime: number,
): number {
  const board = getLeaderboard();
  for (let i = 0; i < board.length; i++) {
    const e = board[i];
    if (
      score > e.score ||
      (score === e.score && correctAnswers > e.correctAnswers) ||
      (score === e.score &&
        correctAnswers === e.correctAnswers &&
        averageTime < e.averageTime)
    ) {
      return i + 1;
    }
  }
  return board.length + 1;
}

export function isNameTaken(name: string): boolean {
  const board = getLeaderboard();
  return board.some((e) => e.name === name);
}

export function deleteFromLeaderboard(id: string): void {
  const board = getLeaderboard();
  const filtered = board.filter((e) => e.id !== id);
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(filtered));
}

export function clearLeaderboard(): void {
  localStorage.removeItem(LEADERBOARD_KEY);
}

export function isOwner(name: string): boolean {
  return name === OWNER_NAME;
}

const ALL_GAME_MODES = ["quiz", "sort-challenge", "true-false", "typing-challenge"];

export interface LegendaryStatus {
  isLegendary: boolean;
  totalTime: number;
  isFastest: boolean;
}

export function checkLegendaryBadge(name: string): LegendaryStatus {
  const board = getLeaderboard();
  const playerEntries = board.filter((e) => e.name === name);

  const completedModes = new Set(playerEntries.map((e) => e.gameMode));
  const hasAllModes = ALL_GAME_MODES.every((m) => completedModes.has(m));

  if (!hasAllModes) {
    return { isLegendary: false, totalTime: 0, isFastest: false };
  }

  const allPerfect = ALL_GAME_MODES.every((mode) => {
    const entry = playerEntries.find((e) => e.gameMode === mode);
    return entry && entry.percentage === 100;
  });

  if (!allPerfect) {
    return { isLegendary: false, totalTime: 0, isFastest: false };
  }

  const totalTime = ALL_GAME_MODES.reduce((sum, mode) => {
    const entry = playerEntries.find((e) => e.gameMode === mode);
    return sum + (entry ? entry.averageTime * 20 : 999);
  }, 0);

  const allNames = new Set(board.map((e) => e.name));
  let isFastest = true;

  for (const otherName of allNames) {
    if (otherName === name) continue;
    const other = checkLegendaryBadge(otherName);
    if (other.isLegendary && other.totalTime < totalTime) {
      isFastest = false;
      break;
    }
  }

  return { isLegendary: true, totalTime, isFastest };
}
