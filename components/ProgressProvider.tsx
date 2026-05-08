"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { allLessons, getNextLessonId } from "@/lib/lessons";
import { defaultProgress, mergeProgress, readProgress, resetProgress, writeProgress } from "@/lib/progress";
import { UserProgress } from "@/lib/types";

type ProgressContextValue = {
  progress: UserProgress;
  ready: boolean;
  setProgress: (next: UserProgress) => void;
  updateProgress: (updater: (current: UserProgress) => UserProgress) => void;
  reset: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);
const SYNC_STATUS_KEY = "spot-the-fish-sync-status";

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [progress, setProgressState] = useState<UserProgress>(defaultProgress);
  const [syncLoggedIn, setSyncLoggedIn] = useState(false);
  const syncReadyRef = useRef(false);
  const lastSyncedProgressRef = useRef("");
  const progressRef = useRef<UserProgress>(defaultProgress);

  useEffect(() => {
    async function loadProgress() {
      const loaded = readProgress();
      const normalized = normalizeUnlockedLessons(loaded);
      let nextProgress = normalized;
      let loggedIn = false;

      try {
        const meResponse = await fetch("/api/access/me", { cache: "no-store" });
        const me = (await meResponse.json()) as { loggedIn?: boolean };
        loggedIn = Boolean(me.loggedIn);

        if (loggedIn) {
          const progressResponse = await fetch("/api/progress", { cache: "no-store" });
          if (progressResponse.ok) {
            const data = (await progressResponse.json()) as { progress?: Partial<UserProgress> };
            nextProgress = normalizeUnlockedLessons(mergeProgress(normalized, data.progress));
          }
        }
      } catch {
        loggedIn = false;
      }

      window.sessionStorage.setItem(SYNC_STATUS_KEY, loggedIn ? "logged-in" : "logged-out");
      setSyncLoggedIn(loggedIn);
      setProgressState(nextProgress);
      progressRef.current = nextProgress;
      writeProgress(nextProgress);
      setReady(true);
      syncReadyRef.current = true;
      lastSyncedProgressRef.current = loggedIn ? "" : JSON.stringify(nextProgress);
      applyBodyPreferences(nextProgress);
    }

    loadProgress();
  }, []);

  useEffect(() => {
    function handleSyncSession(event: Event) {
      const loggedIn = Boolean((event as CustomEvent<{ loggedIn?: boolean }>).detail?.loggedIn);
      window.sessionStorage.setItem(SYNC_STATUS_KEY, loggedIn ? "logged-in" : "logged-out");
      setSyncLoggedIn(loggedIn);
      if (loggedIn) {
        syncReadyRef.current = true;
        lastSyncedProgressRef.current = "";
        mergeRemoteProgressIntoLocal();
      }
    }

    window.addEventListener("spot-the-fish-sync-session", handleSyncSession);
    return () => window.removeEventListener("spot-the-fish-sync-session", handleSyncSession);
  }, []);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    if (!ready || !syncLoggedIn || !syncReadyRef.current) return;

    const serialized = JSON.stringify(progress);
    if (serialized === lastSyncedProgressRef.current) return;

    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/progress", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ progress }),
        });
        if (response.ok) {
          lastSyncedProgressRef.current = serialized;
        }
      } catch {
        // Keep localStorage as the source of truth if background sync is unavailable.
      }
    }, 1800);

    return () => window.clearTimeout(timeout);
  }, [progress, ready, syncLoggedIn]);

  const setProgress = (next: UserProgress) => {
    setProgressState(next);
    progressRef.current = next;
    writeProgress(next);
    applyBodyPreferences(next);
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
        progressRef.current = next;
        applyBodyPreferences(next);
      },
    }),
    [progress, ready],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;

  async function mergeRemoteProgressIntoLocal() {
    try {
      const response = await fetch("/api/progress", { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as { progress?: Partial<UserProgress> };
      const merged = normalizeUnlockedLessons(mergeProgress(progressRef.current, data.progress));
      setProgressState(merged);
      progressRef.current = merged;
      writeProgress(merged);
      applyBodyPreferences(merged);
    } catch {
      // Local progress remains available even if remote sync is temporarily unavailable.
    }
  }
}

function applyBodyPreferences(progress: UserProgress) {
  document.body.classList.toggle("large-text", progress.textSize === "large");
  document.body.classList.toggle("dark-theme", progress.theme === "dark");
}

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("useProgress must be used inside ProgressProvider");
  return value;
}

function normalizeUnlockedLessons(progress: UserProgress): UserProgress {
  const unlockedLessons = new Set(progress.unlockedLessons.length ? progress.unlockedLessons : ["urgent"]);
  unlockedLessons.add(allLessons[0]?.id ?? "urgent");
  progress.completedLessons.forEach((lessonId) => {
    const nextLessonId = getNextLessonId(lessonId);
    if (nextLessonId) unlockedLessons.add(nextLessonId);
  });

  return { ...progress, unlockedLessons: Array.from(unlockedLessons) };
}
