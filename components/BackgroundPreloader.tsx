"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import logoImage from "@/assets/SpottheFish.png";
import faviconImage from "@/assets/favicon.png";
import { fishkoVariants } from "@/components/Fishko";
import { allLessons } from "@/lib/lessons";
import { preloadLesson } from "@/lib/lessonLoaders";
import { useProgress } from "@/components/ProgressProvider";

type IdleWindow = Window & {
  requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  cancelIdleCallback?: (id: number) => void;
};

export function BackgroundPreloader() {
  const router = useRouter();
  const { progress, ready } = useProgress();

  useEffect(() => {
    if (!ready) return;

    const idleWindow = window as IdleWindow;
    const preload = () => {
      const nextLesson =
        allLessons.find((lesson) => progress.unlockedLessons.includes(lesson.id) && !progress.completedLessons.includes(lesson.id)) ??
        allLessons.find((lesson) => progress.unlockedLessons.includes(lesson.id)) ??
        allLessons[0];

      const routes = [
        "/learn",
        "/tips",
        "/settings",
        nextLesson ? `/lesson/${nextLesson.id}` : null,
        nextLesson ? `/play/${nextLesson.id}` : null,
      ].filter(Boolean) as string[];

      if (nextLesson) {
        preloadLesson(nextLesson.id);
      }

      const images = [
        logoImage,
        faviconImage,
        ...fishkoVariants.slice(0, 3),
      ];

      routes.forEach((route, index) => {
        window.setTimeout(() => router.prefetch(route), index * 140);
      });

      images.forEach((image, index) => {
        window.setTimeout(() => {
          const preloaded = new Image();
          preloaded.decoding = "async";
          preloaded.src = image.src;
        }, 500 + index * 160);
      });
    };

    const idleId = idleWindow.requestIdleCallback
      ? idleWindow.requestIdleCallback(preload, { timeout: 3500 })
      : window.setTimeout(preload, 1600);

    return () => {
      if (idleWindow.cancelIdleCallback && typeof idleId === "number") {
        idleWindow.cancelIdleCallback(idleId);
      } else {
        window.clearTimeout(idleId);
      }
    };
  }, [progress.completedLessons, progress.unlockedLessons, ready, router]);

  return null;
}
