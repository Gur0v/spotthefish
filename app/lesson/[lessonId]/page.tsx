"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { getLessonMeta } from "@/lib/lessons";
import { useLesson } from "@/lib/useLesson";
import { useProgress } from "@/components/ProgressProvider";
import { MascotPanel } from "@/components/Fishko";

export default function LessonIntroPage() {
  const params = useParams<{ lessonId: string }>();
  const lessonMeta = getLessonMeta(params.lessonId);
  const { lesson, loading } = useLesson(params.lessonId);
  const { progress } = useProgress();
  if (!lessonMeta) notFound();
  if (loading || !lesson) {
    return (
      <div className="desktop-wrap">
        <section className="fish-card p-4 sm:p-6 lg:p-8">
          <p className="font-extrabold text-fish-dark">Урок {lessonMeta.order}</p>
          <h1 className="mt-2 text-3xl font-extrabold text-fish-text sm:text-5xl">{lessonMeta.title}</h1>
          <p className="mt-4 text-lg font-bold text-fish-muted">Завантажуємо урок...</p>
        </section>
      </div>
    );
  }

  const unlocked = progress.unlockedLessons.includes(lesson.id);

  return (
    <div className="desktop-wrap">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px] lg:gap-8">
        <section className="fish-card p-4 sm:p-6 lg:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-extrabold text-fish-dark">Урок {lesson.order}</p>
            <span className="rounded-full bg-fish-light px-3 py-1 text-sm font-extrabold text-fish-dark">
              {lesson.category}
            </span>
          </div>
          <p className="mt-3 font-bold text-fish-muted">{lesson.moduleTitle}</p>
          <h1 className="mt-2 text-3xl font-extrabold text-fish-text sm:text-5xl">{lesson.title}</h1>
          <p className="mt-4 max-w-3xl text-lg font-semibold leading-relaxed text-fish-muted sm:mt-5 sm:text-xl">{lesson.description}</p>

          <div className="mt-6 rounded-2xl bg-fish-light p-4 sm:mt-8 sm:rounded-[26px] sm:p-6">
            <h2 className="text-xl font-extrabold text-fish-text sm:text-2xl">Що ви навчитеся</h2>
            <div className="mt-4 flex items-start gap-3 text-lg font-bold text-fish-text">
              <CheckCircle2 className="mt-1 text-fish-success" size={24} aria-hidden />
              {lesson.objective}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-fish-border bg-white p-4 sm:mt-8 sm:rounded-[26px] sm:p-6">
            <h2 className="text-xl font-extrabold text-fish-text">Приклад повідомлення</h2>
            <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-base font-bold leading-relaxed text-fish-text sm:p-5 sm:text-lg">
              {lesson.questions[0].type === "spot-red-flags"
                ? lesson.questions[0].messageParts.map((part) => part.text).join("")
                : lesson.questions[0].type === "safe-action"
                  ? lesson.questions[0].scenario
                  : lesson.questions[0].type === "real-or-fake"
                    ? lesson.questions[0].options[1].content
                    : lesson.questions[0].urls[0].text}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
            {unlocked ? (
              <Link href={`/play/${lesson.id}`} className="chunky-primary w-full text-lg sm:w-auto">
                Почати урок
                <ArrowRight size={22} aria-hidden />
              </Link>
            ) : (
              <button className="chunky-button w-full cursor-not-allowed bg-slate-200 text-slate-500 sm:w-auto" disabled>
                <Lock size={21} aria-hidden />
                Урок закрито
              </button>
            )}
            <Link href="/learn" className="chunky-secondary w-full text-lg sm:w-auto">
              На карту
            </Link>
          </div>
        </section>
        <MascotPanel title="Практична порада" tip={lesson.tip} />
      </div>
    </div>
  );
}
