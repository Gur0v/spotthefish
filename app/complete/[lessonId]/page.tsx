"use client";

import Link from "next/link";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Fishko } from "@/components/Fishko";
import { Stars } from "@/components/Stars";
import { getLesson, getNextLessonId } from "@/lib/lessons";
import { getStars } from "@/lib/progress";

export default function CompletePage() {
  const params = useParams<{ lessonId: string }>();
  const search = useSearchParams();
  const lesson = getLesson(params.lessonId);
  if (!lesson) notFound();
  const score = Number(search.get("score") ?? 0);
  const safeScore = Number.isFinite(score) ? score : 0;
  const total = lesson.questions.length;
  const stars = getStars(safeScore, total);
  const nextLessonId = getNextLessonId(lesson.id);

  return (
    <div className="desktop-wrap">
      <section className="fish-card mx-auto grid max-w-5xl grid-cols-1 items-center gap-5 p-4 sm:p-6 lg:grid-cols-[320px_1fr] lg:gap-8 lg:p-8">
        <div className="rounded-2xl bg-fish-light p-4 sm:rounded-[30px] sm:p-6">
          <Fishko className="h-32 w-32 sm:h-44 sm:w-44 lg:h-72 lg:w-72" />
          <div className="mt-3 rounded-2xl bg-white p-4 text-center sm:mt-4 sm:rounded-3xl sm:p-5">
            <p className="font-extrabold text-fish-muted">Зірки за урок</p>
            <div className="mt-2 flex justify-center">
              <Stars count={stars} />
            </div>
          </div>
        </div>
        <div>
          <p className="font-extrabold text-fish-dark">Урок завершено</p>
          <h1 className="mt-2 text-3xl font-extrabold text-fish-text sm:text-5xl">Гарна перевірка!</h1>
          <p className="mt-5 text-2xl font-extrabold text-fish-text">{safeScore} / {total} правильних</p>
          <p className="mt-4 rounded-2xl bg-fish-light p-4 text-base font-extrabold leading-relaxed text-fish-dark sm:rounded-[24px] sm:p-5 sm:text-lg">
            Запам'ятайте: {lesson.tip}
          </p>
          {stars === 0 ? (
            <p className="mt-4 rounded-2xl bg-amber-50 p-4 font-bold text-amber-800">
              Урок зараховано. Фішко радить повторити, щоб спокійніше впізнавати такі пастки.
            </p>
          ) : null}
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-4">
            {nextLessonId ? (
              <Link href={`/lesson/${nextLessonId}`} className="chunky-primary w-full text-lg sm:w-auto">
                Наступний урок
                <ArrowRight size={22} aria-hidden />
              </Link>
            ) : null}
            <Link href="/learn" className="chunky-secondary w-full text-lg sm:w-auto">На карту</Link>
            <Link href={`/play/${lesson.id}`} className="chunky-secondary w-full text-lg sm:w-auto">
              <RotateCcw size={21} aria-hidden />
              Повторити урок
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
