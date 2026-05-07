"use client";

import { notFound, useParams } from "next/navigation";
import { GamePlayer } from "@/components/GamePlayer";
import { useProgress } from "@/components/ProgressProvider";
import { getLesson } from "@/lib/lessons";
import Link from "next/link";
import { Lock } from "lucide-react";

export default function PlayPage() {
  const params = useParams<{ lessonId: string }>();
  const lesson = getLesson(params.lessonId);
  const { progress } = useProgress();
  if (!lesson) notFound();
  if (!progress.unlockedLessons.includes(lesson.id)) {
    return (
      <div className="desktop-wrap">
        <section className="fish-card mx-auto max-w-2xl p-8 text-center">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-slate-100 text-slate-500">
            <Lock size={30} aria-hidden />
          </div>
          <h1 className="text-4xl font-extrabold text-fish-text">Урок ще закрито</h1>
          <p className="mt-3 text-lg font-bold text-fish-muted">Пройдіть попередні уроки на карті, щоб відкрити цей виклик.</p>
          <Link href="/learn" className="chunky-primary mt-7">На карту</Link>
        </section>
      </div>
    );
  }
  return <GamePlayer lesson={lesson} />;
}
