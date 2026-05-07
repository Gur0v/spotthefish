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
      <section className="fish-card mx-auto grid max-w-5xl grid-cols-[360px_1fr] items-center gap-8 p-8">
        <div className="rounded-[30px] bg-fish-light p-6">
          <Fishko />
          <div className="mt-4 rounded-3xl bg-white p-5 text-center">
            <p className="font-extrabold text-fish-muted">Зірки за урок</p>
            <div className="mt-2 flex justify-center">
              <Stars count={stars} />
            </div>
          </div>
        </div>
        <div>
          <p className="font-extrabold text-fish-dark">Урок завершено</p>
          <h1 className="mt-2 text-5xl font-extrabold text-fish-text">Гарна перевірка!</h1>
          <p className="mt-5 text-2xl font-extrabold text-fish-text">{safeScore} / {total} правильних</p>
          <p className="mt-4 rounded-[24px] bg-fish-light p-5 text-lg font-extrabold leading-relaxed text-fish-dark">
            Запам'ятайте: {lesson.tip}
          </p>
          {stars === 0 ? (
            <p className="mt-4 rounded-2xl bg-amber-50 p-4 font-bold text-amber-800">
              Урок зараховано. Фішко радить повторити, щоб спокійніше впізнавати такі пастки.
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-4">
            {nextLessonId ? (
              <Link href={`/lesson/${nextLessonId}`} className="chunky-primary text-lg">
                Наступний урок
                <ArrowRight size={22} aria-hidden />
              </Link>
            ) : null}
            <Link href="/learn" className="chunky-secondary text-lg">На карту</Link>
            <Link href={`/play/${lesson.id}`} className="chunky-secondary text-lg">
              <RotateCcw size={21} aria-hidden />
              Повторити урок
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
