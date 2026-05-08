"use client";

import { useEffect, useState } from "react";
import { loadLesson } from "@/lib/lessonLoaders";
import { Lesson } from "@/lib/types";

export function useLesson(lessonId: string | undefined) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLesson(null);

    if (!lessonId) {
      setLoading(false);
      return;
    }

    loadLesson(lessonId)
      .then((loaded) => {
        if (!cancelled) setLesson(loaded);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  return { lesson, loading };
}
