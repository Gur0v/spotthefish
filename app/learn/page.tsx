"use client";

import Link from "next/link";
import { Check, Lock, PlayCircle } from "lucide-react";
import { allLessons, lessonModules } from "@/lib/lessons";
import { useProgress } from "@/components/ProgressProvider";
import { Stars } from "@/components/Stars";
import { Lesson } from "@/lib/types";

export default function LearnPage() {
  const { progress } = useProgress();

  return (
    <div className="desktop-wrap">
      <div className="mb-5 flex flex-col gap-3 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-extrabold text-fish-dark">Карта уроків</p>
          <h1 className="text-3xl font-extrabold text-fish-text sm:text-5xl">Навчальний маршрут Фішка</h1>
        </div>
        <div className="w-fit rounded-2xl border border-fish-border bg-white px-4 py-3 font-extrabold text-fish-muted sm:rounded-3xl sm:px-6 sm:py-4">
          Пройдено: {progress.completedLessons.length} / {allLessons.length}
        </div>
      </div>

      <div className="space-y-7">
        {lessonModules.map((module, moduleIndex) => {
          const lessons = allLessons
            .filter((lesson) => lesson.moduleId === module.id)
            .sort((a, b) => a.order - b.order);
          const completedCount = lessons.filter((lesson) => progress.completedLessons.includes(lesson.id)).length;

          return (
            <section key={module.id} className="fish-card overflow-hidden">
              <div className="flex flex-col gap-3 border-b border-fish-border bg-fish-light px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-5">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-fish-primary text-lg font-extrabold text-white shadow-button sm:h-14 sm:w-14 sm:text-xl">
                    {moduleIndex + 1}
                  </div>
                  <div>
                    <p className="font-extrabold text-fish-dark">Модуль {moduleIndex + 1}</p>
                    <h2 className="text-2xl font-extrabold text-fish-text sm:text-3xl">{module.title}</h2>
                  </div>
                </div>
                <div className="w-fit rounded-2xl bg-white px-4 py-2 font-extrabold text-fish-muted ring-1 ring-fish-border sm:px-5 sm:py-3">
                  {completedCount} / {lessons.length} уроків
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-5 lg:grid-cols-4 lg:gap-5 lg:p-6">
                {lessons.map((lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function LessonCard({ lesson }: { lesson: Lesson }) {
  const { progress } = useProgress();
  const completed = progress.completedLessons.includes(lesson.id);
  const unlocked = progress.unlockedLessons.includes(lesson.id);
  const current = unlocked && !completed;
  const score = progress.lessonScores[lesson.id];

  const content = (
    <article
      className={`flex min-h-[112px] flex-col rounded-2xl border-2 bg-white p-4 transition sm:min-h-[210px] sm:rounded-[26px] sm:p-5 lg:min-h-[245px] ${
        completed
          ? "border-fish-success"
          : current
            ? "border-fish-primary shadow-soft"
            : unlocked
              ? "border-fish-border hover:-translate-y-1 hover:border-fish-primary hover:shadow-soft"
              : "border-slate-200 bg-slate-50 opacity-75"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3 sm:mb-4">
        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-xl font-extrabold text-white ${completed ? "bg-fish-success" : unlocked ? "bg-fish-primary" : "bg-slate-300"}`}>
          {completed ? <Check size={25} aria-label="Пройдено" /> : unlocked ? lesson.order : <Lock size={23} aria-label="Закрито" />}
        </div>
        {completed ? (
          <Stars count={score?.stars ?? 0} />
        ) : current ? (
          <span className="rounded-full bg-fish-light px-3 py-1 text-sm font-extrabold text-fish-dark">Поточний</span>
        ) : null}
      </div>

      <div className="mb-3 inline-flex w-fit rounded-full bg-fish-light px-3 py-1 text-sm font-extrabold text-fish-dark">
        {lesson.category}
      </div>
      <h3 className="text-lg font-extrabold leading-tight text-fish-text sm:text-xl">{lesson.title}</h3>
      <p className="mt-2 flex-1 text-sm font-semibold leading-relaxed text-fish-muted">{lesson.description}</p>
      <div className="mt-4 flex items-center gap-2 font-extrabold text-fish-dark">
        {unlocked ? <PlayCircle size={18} aria-hidden /> : <Lock size={18} aria-hidden />}
        {completed ? "Повторити урок" : unlocked ? "Відкрити урок" : "Закрито"}
      </div>
    </article>
  );

  return unlocked ? (
    <Link href={`/lesson/${lesson.id}`} aria-label={`Відкрити урок ${lesson.title}`}>
      {content}
    </Link>
  ) : (
    content
  );
}
