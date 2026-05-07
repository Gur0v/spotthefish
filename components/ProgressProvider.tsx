"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { allLessons, getNextLessonId } from "@/lib/lessons";
import { defaultProgress, readProgress, resetProgress, writeProgress } from "@/lib/progress";
import { UserProgress } from "@/lib/types";

type ProgressContextValue = {
  progress: UserProgress;
  ready: boolean;
  setProgress: (next: UserProgress) => void;
  updateProgress: (updater: (current: UserProgress) => UserProgress) => void;
  reset: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [progress, setProgressState] = useState<UserProgress>(defaultProgress);

  useEffect(() => {
    const loaded = readProgress();
    const unlockedLessons = new Set(loaded.unlockedLessons.length ? loaded.unlockedLessons : ["urgent"]);
    unlockedLessons.add(allLessons[0]?.id ?? "urgent");
    loaded.completedLessons.forEach((lessonId) => {
      const nextLessonId = getNextLessonId(lessonId);
      if (nextLessonId) unlockedLessons.add(nextLessonId);
    });
    const normalized = { ...loaded, unlockedLessons: Array.from(unlockedLessons) };
    setProgressState(normalized);
    writeProgress(normalized);
    setReady(true);
    document.body.classList.toggle("large-text", normalized.textSize === "large");
  }, []);

  const setProgress = (next: UserProgress) => {
    setProgressState(next);
    writeProgress(next);
    document.body.classList.toggle("large-text", next.textSize === "large");
  };

  const value = useMemo(
    () => ({
      progress,
      ready,
      setProgress,
      updateProgress: (updater: (current: UserProgress) => UserProgress) => {
        setProgress(updater(progress));
      },
      reset: () => {
        const next = resetProgress();
        setProgressState(next);
        document.body.classList.remove("large-text");
      },
    }),
    [progress, ready],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("useProgress must be used inside ProgressProvider");
  return value;
}
