export function calculateSpeedMultiplier(
  responseTime: number,
  timeLimit: number,
): number {
  const maxMultiplier = 2.0;
  const minMultiplier = 0.5;
  if (responseTime <= 0) return maxMultiplier;
  if (responseTime >= timeLimit) return minMultiplier;
  const ratio = 1 - responseTime / timeLimit;
  return minMultiplier + (maxMultiplier - minMultiplier) * ratio;
}

export function calculateScore(
  basePoints: number,
  responseTime: number,
  timeLimit: number,
): number {
  const multiplier = calculateSpeedMultiplier(responseTime, timeLimit);
  return Math.round(basePoints * multiplier);
}

export function formatTime(seconds: number): string {
  return seconds.toFixed(1);
}
export function formatScore(score: number): string {
  return score.toLocaleString("ar-SA");
}
export function sanitizeName(name: string): string {
  return name
    .trim()
    .slice(0, 20)
    .replace(/[<>\"'"&]/g, "");
}

export function getPerformanceTitle(
  score: number,
  maxPossibleScore: number,
): { title: string; emoji: string } {
  const percentage = (score / maxPossibleScore) * 100;
  if (percentage >= 100) return { title: "أنت مين؟", emoji: "☠️" };
  if (percentage >= 90) return { title: "أسطورة", emoji: "👑" };
  if (percentage >= 76) return { title: "خبير اليوم الوطني", emoji: "🔥" };
  if (percentage >= 61) return { title: "سريع البديهة", emoji: "⚡" };
  if (percentage >= 41) return { title: "باحث", emoji: "🧠" };
  if (percentage >= 21) return { title: "محب للمملكة", emoji: "🇸🇦" };
  return { title: "مبتدئ", emoji: "🌱" };
}

export const MAX_POSSIBLE_SCORE = 26300;
