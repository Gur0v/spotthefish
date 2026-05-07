"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { getLesson } from "@/lib/lessons";
import { useProgress } from "@/components/ProgressProvider";
import { MascotPanel } from "@/components/Fishko";

export default function LessonIntroPage() {
  const params = useParams<{ lessonId: string }>();
  const lesson = getLesson(params.lessonId);
  const { progress } = useProgress();
  if (!lesson) notFound();

  const unlocked = progress.unlockedLessons.includes(lesson.id);

  return (
    <div className="desktop-wrap">
      <div className="grid grid-cols-[1fr_360px] gap-8">
        <section className="fish-card p-8">
          <div className="flex items-center gap-3">
            <p className="font-extrabold text-fish-dark">Урок {lesson.order}</p>
            <span className="rounded-full bg-fish-light px-3 py-1 text-sm font-extrabold text-fish-dark">
              {lesson.category}
            </span>
          </div>
          <p className="mt-3 font-bold text-fish-muted">{lesson.moduleTitle}</p>
          <h1 className="mt-2 text-5xl font-extrabold text-fish-text">{lesson.title}</h1>
          <p className="mt-5 max-w-3xl text-xl font-semibold leading-relaxed text-fish-muted">{lesson.description}</p>

          <div className="mt-8 rounded-[26px] bg-fish-light p-6">
            <h2 className="text-2xl font-extrabold text-fish-text">Що ви навчитеся</h2>
            <div className="mt-4 flex items-start gap-3 text-lg font-bold text-fish-text">
              <CheckCircle2 className="mt-1 text-fish-success" size={24} aria-hidden />
              {lesson.objective}
            </div>
          </div>

          <div className="mt-8 rounded-[26px] border border-fish-border bg-white p-6">
            <h2 className="text-xl font-extrabold text-fish-text">Приклад повідомлення</h2>
            <p className="mt-3 rounded-2xl bg-slate-50 p-5 text-lg font-bold leading-relaxed text-fish-text">
              {lesson.questions[0].type === "spot-red-flags"
                ? lesson.questions[0].messageParts.map((part) => part.text).join("")
                : lesson.questions[0].type === "safe-action"
                  ? lesson.questions[0].scenario
                  : lesson.questions[0].type === "real-or-fake"
                    ? lesson.questions[0].options[1].content
                    : lesson.questions[0].urls[0].text}
            </p>
          </div>

          <div className="mt-8 flex gap-4">
            {unlocked ? (
              <Link href={`/play/${lesson.id}`} className="chunky-primary text-lg">
                Почати урок
                <ArrowRight size={22} aria-hidden />
              </Link>
            ) : (
              <button className="chunky-button cursor-not-allowed bg-slate-200 text-slate-500" disabled>
                <Lock size={21} aria-hidden />
                Урок закрито
              </button>
            )}
            <Link href="/learn" className="chunky-secondary text-lg">
              На карту
            </Link>
          </div>
        </section>
        <MascotPanel title="Практична порада" tip={lesson.tip} />
      </div>
    </div>
  );
}
