import { UserProgress } from "./types";

export const STORAGE_KEY = "spot-the-fish-progress";

export const defaultProgress: UserProgress = {
  completedLessons: [],
  unlockedLessons: ["urgent"],
  lessonScores: {},
  totalStars: 0,
  lastPlayedAt: null,
  streak: 0,
  language: "uk",
  textSize: "normal",
  soundEnabled: true,
};

export function getStars(correct: number, total = 5) {
  const ratio = total > 0 ? correct / total : 0;
  if (ratio >= 1) return 3;
  if (ratio >= 0.8) return 2;
  if (ratio >= 0.6) return 1;
  return 0;
}

export function readProgress(): UserProgress {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    return { ...defaultProgress, ...JSON.parse(raw) };
  } catch {
    return defaultProgress;
  }
}

export function writeProgress(progress: UserProgress) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function resetProgress() {
  writeProgress(defaultProgress);
  return defaultProgress;
}

function dateKey(value: Date) {
  return value.toISOString().slice(0, 10);
}

function yesterdayKey(value: Date) {
  const copy = new Date(value);
  copy.setDate(copy.getDate() - 1);
  return dateKey(copy);
}

export function completeLesson(
  current: UserProgress,
  lessonId: string,
  nextLessonId: string | null,
  correct: number,
  total: number,
) {
  const stars = getStars(correct, total);
  const now = new Date();
  const today = dateKey(now);
  const last = current.lastPlayedAt ? current.lastPlayedAt.slice(0, 10) : null;
  const previous = current.lessonScores[lessonId];
  const bestStars = Math.max(previous?.stars ?? 0, stars);
  const bestCorrect = Math.max(previous?.correct ?? 0, correct);

  const lessonScores = {
    ...current.lessonScores,
    [lessonId]: {
      correct: bestCorrect,
      total,
      stars: bestStars,
      completedAt: now.toISOString(),
    },
  };

  const completedLessons = Array.from(new Set([...current.completedLessons, lessonId]));
  const unlockedLessons = Array.from(
    new Set([...current.unlockedLessons, ...(nextLessonId ? [nextLessonId] : [])]),
  );

  const streak =
    last === today
      ? current.streak || 1
      : last === yesterdayKey(now)
        ? current.streak + 1
        : 1;

  const next = {
    ...current,
    completedLessons,
    unlockedLessons,
    lessonScores,
    totalStars: Object.values(lessonScores).reduce((sum, score) => sum + score.stars, 0),
    lastPlayedAt: now.toISOString(),
    streak,
  };

  writeProgress(next);
  return next;
}
