"use client";

import { notFound, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useProgress } from "@/components/ProgressProvider";
import { getLessonMeta } from "@/lib/lessons";
import { useLesson } from "@/lib/useLesson";
import Link from "next/link";
import { Lock } from "lucide-react";

const GamePlayer = dynamic(() => import("@/components/GamePlayer").then((module) => module.GamePlayer), {
  loading: () => (
    <div className="desktop-wrap">
      <section className="fish-card p-4 sm:p-6 lg:p-8">
        <p className="text-lg font-bold text-fish-muted">Готуємо завдання...</p>
      </section>
    </div>
  ),
});

export default function PlayPage() {
  const params = useParams<{ lessonId: string }>();
  const lessonMeta = getLessonMeta(params.lessonId);
  const { lesson, loading } = useLesson(params.lessonId);
  const { progress } = useProgress();
  if (!lessonMeta) notFound();
  if (!progress.unlockedLessons.includes(lessonMeta.id)) {
    return (
      <div className="desktop-wrap">
        <section className="fish-card mx-auto max-w-2xl p-4 text-center sm:p-8">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-slate-100 text-slate-500">
            <Lock size={30} aria-hidden />
          </div>
          <h1 className="text-3xl font-extrabold text-fish-text sm:text-4xl">Урок ще закрито</h1>
          <p className="mt-3 text-lg font-bold text-fish-muted">Пройдіть попередні уроки на карті, щоб відкрити цей виклик.</p>
          <Link href="/learn" className="chunky-primary mt-7 w-full sm:w-auto">На карту</Link>
        </section>
      </div>
    );
  }
  if (loading || !lesson) {
    return (
      <div className="desktop-wrap">
        <section className="fish-card p-4 sm:p-6 lg:p-8">
          <p className="text-lg font-bold text-fish-muted">Завантажуємо урок...</p>
        </section>
      </div>
    );
  }
  return <GamePlayer lesson={lesson} />;
}
