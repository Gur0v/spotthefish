"use client";

import { useState } from "react";
import { CheckCircle2, RotateCcw, Volume2 } from "lucide-react";
import { allLessons } from "@/lib/lessons";
import { useProgress } from "@/components/ProgressProvider";

export default function SettingsPage() {
  const { progress, setProgress, reset } = useProgress();
  const [languageClicks, setLanguageClicks] = useState(0);
  const [showUnlockWindow, setShowUnlockWindow] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  function handleUkrainianClick() {
    const nextClicks = languageClicks + 1;
    setLanguageClicks(nextClicks);

    if (nextClicks >= 20) {
      setProgress({
        ...progress,
        language: "uk",
        unlockedLessons: allLessons.map((lesson) => lesson.id),
      });
      setLanguageClicks(0);
      setShowUnlockWindow(true);
    }
  }

  return (
    <div className="desktop-wrap">
      <div className="mb-7">
        <p className="font-extrabold text-fish-dark">Локальні налаштування</p>
        <h1 className="text-5xl font-extrabold text-fish-text">Settings</h1>
      </div>
      <section className="grid grid-cols-[1fr_360px] gap-8">
        <div className="fish-card space-y-6 p-8">
          <SettingBlock title="Мова">
            <div className="flex gap-3">
              <button onClick={handleUkrainianClick} className="chunky-primary">Українська</button>
              <button className="chunky-secondary opacity-70" disabled>English</button>
            </div>
          </SettingBlock>

          <SettingBlock title="Звук">
            <button
              onClick={() => setProgress({ ...progress, soundEnabled: !progress.soundEnabled })}
              className={progress.soundEnabled ? "chunky-primary" : "chunky-secondary"}
            >
              <Volume2 size={21} aria-hidden />
              {progress.soundEnabled ? "Увімкнено" : "Вимкнено"}
            </button>
          </SettingBlock>

          <SettingBlock title="Розмір тексту">
            <div className="flex gap-3">
              <button
                onClick={() => setProgress({ ...progress, textSize: "normal" })}
                className={progress.textSize === "normal" ? "chunky-primary" : "chunky-secondary"}
              >
                Звичайний
              </button>
              <button
                onClick={() => setProgress({ ...progress, textSize: "large" })}
                className={progress.textSize === "large" ? "chunky-primary" : "chunky-secondary"}
              >
                Великий
              </button>
            </div>
          </SettingBlock>

          <SettingBlock title="Прогрес">
            <button onClick={() => setShowResetConfirm(true)} className="chunky-secondary border-fish-danger text-fish-danger hover:border-fish-danger hover:text-fish-danger">
              <RotateCcw size={21} aria-hidden />
              Скинути прогрес
            </button>
          </SettingBlock>
        </div>
        <aside className="fish-card p-6">
          <h2 className="text-2xl font-extrabold text-fish-text">Приватність</h2>
          <p className="mt-4 text-lg font-bold leading-relaxed text-fish-muted">
            Тут немає акаунтів, платежів, профілів і збору особистих даних. Прогрес, зірки, серія, звук і розмір тексту зберігаються тільки у localStorage вашого браузера.
          </p>
          <div className="mt-6 rounded-3xl bg-fish-light p-5 font-extrabold text-fish-dark">
            Якщо скинути прогрес або очистити дані браузера, уроки почнуться спочатку.
          </div>
        </aside>
      </section>

      {showUnlockWindow ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/35 p-8" role="dialog" aria-modal="true" aria-labelledby="unlock-title">
          <div className="fish-card max-w-md p-7 text-center">
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-green-50 text-fish-success">
              <CheckCircle2 size={34} aria-hidden />
            </div>
            <h2 id="unlock-title" className="text-3xl font-extrabold text-fish-text">
              Усі уроки відкрито
            </h2>
            <p className="mt-3 text-lg font-bold leading-relaxed text-fish-muted">
              Фішко розблокував усі уроки на карті. Можна проходити їх у будь-якому порядку.
            </p>
            <button onClick={() => setShowUnlockWindow(false)} className="chunky-primary mt-6">
              Готово
            </button>
          </div>
        </div>
      ) : null}

      {showResetConfirm ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/35 p-8" role="dialog" aria-modal="true" aria-labelledby="reset-title">
          <div className="fish-card max-w-lg p-7">
            <div className="mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-red-50 text-fish-danger">
              <RotateCcw size={32} aria-hidden />
            </div>
            <h2 id="reset-title" className="text-3xl font-extrabold text-fish-text">
              Скинути прогрес?
            </h2>
            <p className="mt-3 text-lg font-bold leading-relaxed text-fish-muted">
              Це закриє пройдені уроки, прибере зірки, серію та результати. Дані буде очищено тільки у цьому браузері.
            </p>
            <div className="mt-7 flex justify-end gap-3">
              <button onClick={() => setShowResetConfirm(false)} className="chunky-secondary">
                Залишити як є
              </button>
              <button
                onClick={() => {
                  reset();
                  setShowResetConfirm(false);
                }}
                className="chunky-primary bg-fish-danger shadow-[0_5px_0_#B91C1C] hover:bg-red-600"
              >
                Так, скинути
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SettingBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[26px] border border-fish-border bg-white p-6">
      <h2 className="mb-4 text-2xl font-extrabold text-fish-text">{title}</h2>
      {children}
    </section>
  );
}
