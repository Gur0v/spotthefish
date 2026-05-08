export type TextSize = "normal" | "large";
export type ThemeMode = "light" | "dark";

export type UserProgress = {
  completedLessons: string[];
  unlockedLessons: string[];
  lessonScores: Record<
    string,
    {
      correct: number;
      total: number;
      stars: number;
      completedAt: string;
    }
  >;
  totalStars: number;
  lastPlayedAt: string | null;
  streak: number;
  language: "uk" | "en";
  textSize: TextSize;
  theme: ThemeMode;
  soundEnabled: boolean;
};

export type Lesson = {
  id: string;
  order: number;
  moduleId: string;
  moduleTitle: string;
  category: string;
  title: string;
  description: string;
  objective: string;
  tip: string;
  questions: GameQuestion[];
};

export type LessonMeta = Omit<Lesson, "questions">;

export type SpotRedFlagsGame = {
  id: string;
  type: "spot-red-flags";
  prompt: string;
  messageParts: {
    id: string;
    text: string;
    isFlag: boolean;
    explanation?: string;
  }[];
  requiredFlags: string[];
  successFeedback: string;
  failureFeedback: string;
  rule: string;
};

export type RealOrFakeGame = {
  id: string;
  type: "real-or-fake";
  prompt: string;
  options: {
    id: string;
    label: string;
    content: string;
  }[];
  correctOptionId: string;
  successFeedback: string;
  failureFeedback: string;
  rule: string;
};

export type SafeActionGame = {
  id: string;
  type: "safe-action";
  scenario: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  successFeedback: string;
  failureFeedback: string;
  rule: string;
};

export type LinkCheckGame = {
  id: string;
  type: "link-check";
  prompt: string;
  urls: {
    id: string;
    text: string;
  }[];
  correctUrlId: string;
  successFeedback: string;
  failureFeedback: string;
  rule: string;
};

export type GameQuestion =
  | SpotRedFlagsGame
  | RealOrFakeGame
  | SafeActionGame
  | LinkCheckGame;
