"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, CircleAlert, CircleCheck, MousePointerClick, XCircle } from "lucide-react";
import { completeLesson } from "@/lib/progress";
import { getNextLessonId } from "@/lib/lessons";
import { GameQuestion, Lesson } from "@/lib/types";
import { useProgress } from "./ProgressProvider";
import { fishkoVariants, MascotPanel } from "./Fishko";
import { ProgressBar } from "./ProgressBar";

type Feedback = { correct: boolean; text: string; rule: string };

function getRule(question: GameQuestion) {
  return `Запам'ятайте: ${question.rule}`;
}

export function GamePlayer({ lesson }: { lesson: Lesson }) {
  const router = useRouter();
  const { progress, setProgress } = useProgress();
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const question = lesson.questions[index];
  const total = lesson.questions.length;
  const mascotImages = useMemo(() => {
    let previous = -1;
    return lesson.questions.map(() => {
      let next = Math.floor(Math.random() * fishkoVariants.length);
      if (fishkoVariants.length > 1 && next === previous) {
        next = (next + 1) % fishkoVariants.length;
      }
      previous = next;
      return fishkoVariants[next];
    });
  }, [lesson.id, lesson.questions]);

  const selectedClues = useMemo(() => {
    if (question.type !== "spot-red-flags") return [];
    return question.messageParts.filter((part) => selected.includes(part.id) && part.explanation);
  }, [question, selected]);

  function choose(id: string) {
    if (feedback) return;
    if (question.type === "spot-red-flags") {
      setSelected((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));
      return;
    }
    setSelected([id]);
  }

  function check() {
    if (feedback) return;
    let correct = false;
    if (question.type === "spot-red-flags") {
      const required = [...question.requiredFlags].sort().join(",");
      correct = selected.filter((id) => question.requiredFlags.includes(id)).sort().join(",") === required && selected.every((id) => question.requiredFlags.includes(id));
    } else if (question.type === "real-or-fake" || question.type === "safe-action") {
      correct = selected[0] === question.correctOptionId;
    } else {
      correct = selected[0] === question.correctUrlId;
    }
    if (correct) setCorrectCount((count) => count + 1);
    setFeedback({
      correct,
      text: correct ? question.successFeedback : question.failureFeedback,
      rule: getRule(question),
    });
  }

  function next() {
    if (index < total - 1) {
      setIndex((value) => value + 1);
      setSelected([]);
      setFeedback(null);
      return;
    }
    const finalCorrect = correctCount + (feedback?.correct ? 1 : 0);
    const nextProgress = completeLesson(progress, lesson.id, getNextLessonId(lesson.id), finalCorrect, total);
    setProgress(nextProgress);
    router.push(`/complete/${lesson.id}?score=${finalCorrect}`);
  }

  return (
    <div className="desktop-wrap">
      <div className="mb-6 grid grid-cols-[1fr_180px] items-end gap-6">
        <div>
          <p className="font-extrabold text-fish-dark">{lesson.title}</p>
          <h1 className="text-4xl font-extrabold text-fish-text">Питання {index + 1} / {total}</h1>
        </div>
        <div className="text-right text-2xl font-extrabold text-fish-text">{correctCount} правильних</div>
      </div>
      <ProgressBar current={index + (feedback ? 1 : 0)} total={total} />

      <div className="mt-7 grid grid-cols-[1fr_360px] gap-8">
        <section className="fish-card flex min-h-[480px] flex-col p-7">
          <div className="mb-5 flex items-center gap-2 font-extrabold text-fish-dark">
            <MousePointerClick size={22} aria-hidden />
            {question.type === "safe-action" ? question.question : question.prompt}
          </div>
          <QuestionView question={question} selected={selected} onChoose={choose} locked={Boolean(feedback)} />

          {feedback ? (
            <div className={`mt-auto rounded-[24px] border-2 p-5 ${feedback.correct ? "border-fish-success bg-green-50" : "border-fish-warning bg-amber-50"}`} role="status">
              <div className={`flex items-center gap-2 text-xl font-extrabold ${feedback.correct ? "text-green-700" : "text-amber-700"}`}>
                {feedback.correct ? <CheckCircle2 aria-hidden /> : <CircleAlert aria-hidden />}
                {feedback.correct ? "Правильно." : "Не зовсім."}
              </div>
              <p className="mt-2 text-lg font-bold leading-relaxed text-fish-text">{feedback.text}</p>
              <p className="mt-3 rounded-2xl bg-white p-3 font-extrabold text-fish-dark">{feedback.rule}</p>
            </div>
          ) : null}

          <div className="mt-6 flex justify-end gap-3">
            {feedback ? (
              <button onClick={next} className="chunky-primary text-lg">Продовжити</button>
            ) : (
              <button onClick={check} disabled={selected.length === 0} className="chunky-primary text-lg disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none">
                Перевірити
              </button>
            )}
          </div>
        </section>
        <aside className="space-y-5">
          <MascotPanel tip={lesson.tip} title="Правило уроку" image={mascotImages[index]} />
          <div className="fish-card p-5">
            <h2 className="font-extrabold text-fish-text">Обрані підказки</h2>
            {selectedClues.length ? (
              <ul className="mt-3 space-y-2">
                {selectedClues.map((part) => (
                  <li key={part.id} className="rounded-2xl bg-fish-light p-3 font-bold text-fish-text">{part.explanation}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 font-semibold text-fish-muted">Натискайте на підозрілі частини або оберіть відповідь.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function QuestionView({ question, selected, onChoose, locked }: { question: GameQuestion; selected: string[]; onChoose: (id: string) => void; locked: boolean }) {
  if (question.type === "spot-red-flags") {
    return (
      <div className="rounded-[26px] bg-slate-50 p-7 text-2xl font-extrabold leading-[1.8] text-fish-text">
        {question.messageParts.map((part) => {
          const isSelected = selected.includes(part.id);
          const revealed = locked && part.isFlag;
          const wrong = locked && isSelected && !part.isFlag;
          return (
            <button
              key={part.id}
              type="button"
              onClick={() => onChoose(part.id)}
              className={`mx-1 my-1 rounded-xl px-2 py-1 text-left transition hover:bg-fish-light ${
                revealed ? "bg-green-100 text-green-800 ring-2 ring-fish-success" : wrong ? "bg-red-100 text-red-800 ring-2 ring-fish-danger" : isSelected ? "bg-fish-light text-fish-dark ring-2 ring-fish-primary" : ""
              }`}
            >
              {revealed ? <CircleCheck className="mr-1 inline" size={18} aria-label="Правильний сигнал" /> : wrong ? <XCircle className="mr-1 inline" size={18} aria-label="Не сигнал" /> : null}
              {part.text}
            </button>
          );
        })}
      </div>
    );
  }

  if (question.type === "real-or-fake") {
    return (
      <div className="grid grid-cols-2 gap-5">
        {question.options.map((option) => <OptionCard key={option.id} id={option.id} label={option.label} text={option.content} selected={selected.includes(option.id)} correct={locked && option.id === question.correctOptionId} wrong={locked && selected.includes(option.id) && option.id !== question.correctOptionId} onChoose={onChoose} />)}
      </div>
    );
  }

  if (question.type === "safe-action") {
    return (
      <div>
        <div className="mb-5 rounded-[24px] bg-slate-50 p-5 text-xl font-bold leading-relaxed text-fish-text">{question.scenario}</div>
        <div className="grid grid-cols-2 gap-4">
          {question.options.map((option) => <OptionCard key={option.id} id={option.id} label="" text={option.text} selected={selected.includes(option.id)} correct={locked && option.id === question.correctOptionId} wrong={locked && selected.includes(option.id) && option.id !== question.correctOptionId} onChoose={onChoose} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {question.urls.map((url) => <OptionCard key={url.id} id={url.id} label="URL" text={url.text} selected={selected.includes(url.id)} correct={locked && url.id === question.correctUrlId} wrong={locked && selected.includes(url.id) && url.id !== question.correctUrlId} onChoose={onChoose} monospace />)}
    </div>
  );
}

function OptionCard({ id, label, text, selected, correct, wrong, onChoose, monospace = false }: { id: string; label: string; text: string; selected: boolean; correct: boolean; wrong: boolean; onChoose: (id: string) => void; monospace?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => onChoose(id)}
      className={`min-h-36 rounded-[24px] border-2 bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-soft ${
        correct ? "border-fish-success bg-green-50" : wrong ? "border-fish-danger bg-red-50" : selected ? "border-fish-primary bg-fish-light" : "border-fish-border"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="font-extrabold text-fish-dark">{label}</span>
        {correct ? <CircleCheck className="text-fish-success" aria-label="Правильна відповідь" /> : wrong ? <XCircle className="text-fish-danger" aria-label="Невдала відповідь" /> : null}
      </div>
      <p className={`${monospace ? "font-mono text-base" : "text-lg font-bold"} leading-relaxed text-fish-text`}>{text}</p>
    </button>
  );
}
