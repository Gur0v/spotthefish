"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Check, CheckCircle2, Cloud, Copy, Download, KeyRound, LogOut, Moon, Sun, Trash2, RotateCcw, Volume2 } from "lucide-react";
import { allLessons } from "@/lib/lessons";
import { mergeProgress } from "@/lib/progress";
import { useProgress } from "@/components/ProgressProvider";

export default function SettingsPage() {
  const { progress, setProgress, reset } = useProgress();
  const [languageClicks, setLanguageClicks] = useState(0);
  const [showUnlockWindow, setShowUnlockWindow] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [accessCodeSaved, setAccessCodeSaved] = useState(false);
  const [accessCodeMode, setAccessCodeMode] = useState<"created" | "regenerated">("created");
  const [codeInput, setCodeInput] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [syncAvailable, setSyncAvailable] = useState(true);
  const [syncMessage, setSyncMessage] = useState("");
  const [syncError, setSyncError] = useState("");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const normalizedCodeInput = codeInput.replace(/\D/g, "");
  const codeInputError = codeInput && normalizedCodeInput.length !== 16 ? "Код має містити 16 цифр" : "";

  useEffect(() => {
    fetch("/api/access/me")
      .then((response) => response.json())
      .then((data: { loggedIn?: boolean; syncAvailable?: boolean }) => {
        setLoggedIn(Boolean(data.loggedIn));
        setSyncAvailable(data.syncAvailable !== false);
      })
      .catch(() => {
        setLoggedIn(false);
        setSyncAvailable(false);
      });
  }, []);

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

  async function readApiError(response: Response, fallback: string) {
    try {
      const data = (await response.json()) as { error?: string };
      return data.error ?? fallback;
    } catch {
      return fallback;
    }
  }

  async function runAccessAction(action: string, callback: () => Promise<void>) {
    setLoadingAction(action);
    setSyncError("");
    setSyncMessage("");
    try {
      await callback();
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : "Щось пішло не так");
    } finally {
      setLoadingAction(null);
    }
  }

  async function createAccessCode() {
    await runAccessAction("create", async () => {
      const response = await fetch("/api/access/create", { method: "POST" });
      if (!response.ok) throw new Error(await readApiError(response, "Не вдалося створити код доступу"));
      const data = (await response.json()) as { accessCode: string };
      setAccessCode(data.accessCode);
      setAccessCodeMode("created");
      setAccessCodeSaved(false);
      setLoggedIn(true);
      notifyAutoSync(true);
      setSyncMessage("Код створено. Збережіть його в безпечному місці.");
    });
  }

  async function loginWithCode() {
    await runAccessAction("login", async () => {
      const response = await fetch("/api/access/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeInput }),
      });
      if (!response.ok) throw new Error(await readApiError(response, "Неправильний код доступу"));
      setLoggedIn(true);
      setAccessCode("");
      setAccessCodeSaved(false);
      notifyAutoSync(true);
      setSyncMessage("Вхід за кодом виконано. Тепер можна синхронізувати прогрес.");
    });
  }

  async function saveProgressToCode() {
    await runAccessAction("save", async () => {
      const response = await fetch("/api/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress }),
      });
      if (!response.ok) throw new Error(await readApiError(response, "Не вдалося зберегти прогрес"));
      setSyncMessage("Поточний прогрес збережено в код доступу.");
    });
  }

  async function loadProgressFromCode() {
    await runAccessAction("load", async () => {
      const response = await fetch("/api/progress");
      if (!response.ok) throw new Error(await readApiError(response, "Не вдалося завантажити прогрес"));
      const data = (await response.json()) as { progress?: Partial<typeof progress> };
      const merged = mergeProgress(progress, data.progress);
      setProgress(merged);
      setSyncMessage("Прогрес з коду об'єднано з цим браузером.");
    });
  }

  async function syncNow() {
    await runAccessAction("sync", async () => {
      const response = await fetch("/api/progress");
      if (!response.ok) throw new Error(await readApiError(response, "Не вдалося завантажити прогрес"));
      const data = (await response.json()) as { progress?: Partial<typeof progress> };
      const merged = mergeProgress(progress, data.progress);
      setProgress(merged);
      const saveResponse = await fetch("/api/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: merged }),
      });
      if (!saveResponse.ok) throw new Error(await readApiError(saveResponse, "Не вдалося зберегти прогрес"));
      setSyncMessage("Синхронізацію виконано.");
    });
  }

  async function logoutAccessCode() {
    await runAccessAction("logout", async () => {
      const response = await fetch("/api/access/logout", { method: "POST" });
      if (!response.ok) throw new Error("Не вдалося вийти з коду доступу");
      setLoggedIn(false);
      setAccessCode("");
      setAccessCodeSaved(false);
      setCodeInput("");
      notifyAutoSync(false);
      setSyncMessage("Синхронізацію вимкнено на цьому пристрої.");
    });
  }

  async function deleteAccessAccount() {
    await runAccessAction("delete", async () => {
      const response = await fetch("/api/access/delete", { method: "POST" });
      if (!response.ok) throw new Error(await readApiError(response, "Не вдалося видалити код доступу"));
      setLoggedIn(false);
      setAccessCode("");
      setAccessCodeSaved(false);
      setCodeInput("");
      setShowDeleteAccountConfirm(false);
      notifyAutoSync(false);
      setSyncMessage("Код доступу видалено. Локальний прогрес у цьому браузері залишився.");
    });
  }

  async function regenerateAccessCode() {
    await runAccessAction("regenerate", async () => {
      const response = await fetch("/api/access/regenerate", { method: "POST" });
      if (!response.ok) throw new Error(await readApiError(response, "Не вдалося створити новий код доступу"));
      const data = (await response.json()) as { accessCode: string };
      setAccessCode(data.accessCode);
      setAccessCodeMode("regenerated");
      setAccessCodeSaved(false);
      setShowRegenerateConfirm(false);
      setSyncMessage("Новий код доступу створено. Збережіть його зараз.");
    });
  }

  function downloadAccessCodeTxt() {
    if (!accessCode) return;

    const contents = [
      "Spot the Fish - код доступу",
      "",
      accessCode,
      "",
      "Збережіть цей код у безпечному місці.",
      "Він потрібен, щоб синхронізувати прогрес між пристроями.",
      "Spot the Fish не зможе показати цей код ще раз.",
      "Якщо ви втратите код доступу, відновити цей акаунт буде неможливо.",
      "",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([contents], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "spot-the-fish-access-code.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setSyncMessage("TXT з кодом завантажено.");
  }

  return (
    <div className="desktop-wrap">
      <div className="mb-7">
        <p className="font-extrabold text-fish-dark">Локальні налаштування</p>
        <h1 className="text-3xl font-extrabold text-fish-text sm:text-5xl">Settings</h1>
      </div>
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px] lg:gap-8">
        <div className="fish-card space-y-5 p-4 sm:p-6 lg:p-8">
          <SettingBlock title="Мова">
            <div className="flex flex-col gap-3 sm:flex-row">
              <button onClick={handleUkrainianClick} className="chunky-primary w-full sm:w-auto">Українська</button>
              <button
                className="chunky-secondary w-full cursor-not-allowed opacity-60 sm:w-auto"
                disabled
                title="English is unavailable at the moment, please use Google Translate."
              >
                English
              </button>
            </div>
          </SettingBlock>

          <SettingBlock title="Код доступу">
            <div className="space-y-5">
              <p className="max-w-2xl text-lg font-bold leading-relaxed text-fish-muted">
                Синхронізуйте прогрес між пристроями без пошти, імені чи пароля.
              </p>

              {!syncAvailable ? (
                <div className="rounded-2xl border border-fish-border bg-slate-50 p-4 font-extrabold text-fish-muted sm:rounded-3xl">
                  Синхронізація недоступна в цій збірці.
                </div>
              ) : null}

              {syncAvailable && !loggedIn ? (
                <div className="space-y-4">
                  <button onClick={createAccessCode} disabled={Boolean(loadingAction)} className="chunky-primary w-full disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none sm:w-auto">
                    <Cloud size={21} aria-hidden />
                    Створити код доступу
                  </button>
                  <div className="rounded-2xl border border-fish-border bg-slate-50 p-4 sm:rounded-3xl">
                    <label htmlFor="access-code" className="mb-2 block font-extrabold text-fish-text">
                      У мене вже є код
                    </label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <input
                        id="access-code"
                        value={codeInput}
                        onChange={(event) => setCodeInput(event.target.value)}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        placeholder="1234 5678 9012 3456"
                        className="min-h-12 min-w-0 flex-1 rounded-2xl border-2 border-fish-border bg-white px-4 text-lg font-bold text-fish-text outline-none focus:border-fish-primary focus:ring-4 focus:ring-blue-100"
                      />
                      <button onClick={loginWithCode} disabled={Boolean(loadingAction) || Boolean(codeInputError)} className="chunky-secondary w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
                        Увійти за кодом
                      </button>
                    </div>
                    {codeInputError ? <p className="mt-2 font-bold text-fish-danger">{codeInputError}</p> : null}
                  </div>
                </div>
              ) : null}

              {syncAvailable && accessCode ? (
                <div className="rounded-2xl border-2 border-fish-primary bg-fish-light p-4 sm:rounded-3xl sm:p-5">
                  <p className="font-extrabold text-fish-dark">
                    {accessCodeMode === "regenerated"
                      ? "Новий код доступу створено. Збережіть його зараз. Ми не зможемо показати його ще раз."
                      : "Збережіть цей код. Ми не зможемо показати його ще раз."}
                  </p>
                  <div className="mt-3 flex min-h-[64px] items-center justify-center rounded-2xl bg-white px-4 font-sans text-2xl font-extrabold leading-none tracking-[0.16em] text-fish-text sm:px-5">
                    <span className="translate-y-px">{accessCode}</span>
                  </div>
                  <div className="mt-4 rounded-2xl border border-fish-warning bg-amber-50 p-4 font-bold leading-relaxed text-fish-text">
                    <div className="mb-2 flex items-center gap-2 font-extrabold text-fish-warning">
                      <AlertTriangle size={20} aria-hidden />
                      Важливо
                    </div>
                    Якщо ви втратите код доступу, відновити цей акаунт буде неможливо. Це пов’язано з тим, як сайт зберігає дані: код не зберігається у відкритому вигляді, а лише перевіряється через захищені хеші.
                  </div>
                  <label className="mt-4 flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl bg-white px-4 py-3 font-extrabold text-fish-text ring-1 ring-fish-border">
                    <input
                      type="checkbox"
                      checked={accessCodeSaved}
                      onChange={(event) => setAccessCodeSaved(event.target.checked)}
                      className="peer sr-only"
                    />
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-xl border-2 border-fish-border bg-fish-card text-transparent transition peer-checked:border-fish-primary peer-checked:bg-fish-primary peer-checked:text-white">
                      <Check size={19} strokeWidth={3.2} aria-hidden />
                    </span>
                    Я зберіг/зберегла код доступу
                  </label>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(accessCode);
                        setSyncMessage("Код скопійовано.");
                      }}
                      className="chunky-secondary w-full sm:w-auto"
                    >
                      <Copy size={20} aria-hidden />
                      Скопіювати код
                    </button>
                    <button onClick={downloadAccessCodeTxt} className="chunky-secondary w-full sm:w-auto">
                      <Download size={20} aria-hidden />
                      Завантажити TXT
                    </button>
                    <button onClick={saveProgressToCode} disabled={Boolean(loadingAction) || !accessCodeSaved} className="chunky-primary w-full disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none sm:w-auto">
                      Синхронізувати мій прогрес
                    </button>
                  </div>
                </div>
              ) : null}

              {syncAvailable && loggedIn && !accessCode ? (
                <div className="rounded-2xl border border-fish-border bg-fish-light p-4 sm:rounded-3xl sm:p-5">
                  <p className="font-extrabold text-fish-dark">Синхронізацію увімкнено на цьому пристрої.</p>
                  <p className="mt-2 font-bold leading-relaxed text-fish-muted">
                    Ми не можемо відновити втрачений код, бо не зберігаємо його у відкритому вигляді.
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <button onClick={syncNow} disabled={Boolean(loadingAction)} className="chunky-primary w-full disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none sm:w-auto">
                      Синхронізувати зараз
                    </button>
                    <button onClick={loadProgressFromCode} disabled={Boolean(loadingAction)} className="chunky-secondary w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
                      Завантажити прогрес з коду
                    </button>
                    <button onClick={saveProgressToCode} disabled={Boolean(loadingAction)} className="chunky-secondary w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
                      Зберегти цей прогрес у код
                    </button>
                    <button onClick={() => setShowRegenerateConfirm(true)} disabled={Boolean(loadingAction)} className="chunky-secondary w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
                      <KeyRound size={20} aria-hidden />
                      Згенерувати новий код доступу
                    </button>
                    <button onClick={logoutAccessCode} disabled={Boolean(loadingAction)} className="chunky-secondary w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
                      <LogOut size={20} aria-hidden />
                      Вийти з коду доступу
                    </button>
                    <button
                      onClick={() => setShowDeleteAccountConfirm(true)}
                      disabled={Boolean(loadingAction)}
                      className="chunky-secondary w-full border-fish-danger text-fish-danger hover:border-fish-danger hover:text-fish-danger disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      <Trash2 size={20} aria-hidden />
                      Видалити код доступу
                    </button>
                  </div>
                </div>
              ) : null}

              {syncMessage ? <p className="rounded-2xl bg-green-50 p-3 font-bold text-green-700">{syncMessage}</p> : null}
              {syncError ? <p className="rounded-2xl bg-red-50 p-3 font-bold text-red-700">{syncError}</p> : null}
            </div>
          </SettingBlock>

          <SettingBlock title="Звук">
            <button
              onClick={() => setProgress({ ...progress, soundEnabled: !progress.soundEnabled })}
              className={progress.soundEnabled ? "chunky-primary w-full sm:w-auto" : "chunky-secondary w-full sm:w-auto"}
            >
              <Volume2 size={21} aria-hidden />
              {progress.soundEnabled ? "Увімкнено" : "Вимкнено"}
            </button>
          </SettingBlock>

          <SettingBlock title="Розмір тексту">
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setProgress({ ...progress, textSize: "normal" })}
                className={`${progress.textSize === "normal" ? "chunky-primary" : "chunky-secondary"} w-full sm:w-auto`}
              >
                Звичайний
              </button>
              <button
                onClick={() => setProgress({ ...progress, textSize: "large" })}
                className={`${progress.textSize === "large" ? "chunky-primary" : "chunky-secondary"} w-full sm:w-auto`}
              >
                Великий
              </button>
            </div>
          </SettingBlock>

          <SettingBlock title="Тема">
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setProgress({ ...progress, theme: "light" })}
                className={`${progress.theme === "light" ? "chunky-primary" : "chunky-secondary"} w-full sm:w-auto`}
              >
                <Sun size={21} aria-hidden />
                Світла
              </button>
              <button
                onClick={() => setProgress({ ...progress, theme: "dark" })}
                className={`${progress.theme === "dark" ? "chunky-primary" : "chunky-secondary"} w-full sm:w-auto`}
              >
                <Moon size={21} aria-hidden />
                Темна
              </button>
            </div>
          </SettingBlock>

          <SettingBlock title="Прогрес">
            <button onClick={() => setShowResetConfirm(true)} className="chunky-secondary w-full border-fish-danger text-fish-danger hover:border-fish-danger hover:text-fish-danger sm:w-auto">
              <RotateCcw size={21} aria-hidden />
              Скинути прогрес
            </button>
          </SettingBlock>
        </div>
        <aside className="fish-card p-4 sm:p-6">
          <h2 className="text-2xl font-extrabold text-fish-text">Приватність</h2>
          <p className="mt-4 text-lg font-bold leading-relaxed text-fish-muted">
            Ми не просимо пошту, ім’я, пароль або оплату.
          </p>
          <p className="mt-4 text-lg font-bold leading-relaxed text-fish-muted">
            Без коду доступу прогрес зберігається тільки в цьому браузері. Якщо увімкнути код доступу, ми зберігаємо лише ваш прогрес і налаштування: зірки, серію, звук, розмір тексту і тему.
          </p>
          <p className="mt-4 text-lg font-bold leading-relaxed text-fish-muted">
            Код не можна відновити, якщо ви його загубите. Ми не зберігаємо сам код. Відкритий код сайту можна подивитися{" "}
            <a
              href="https://github.com/Gur0v/spotthefish"
              target="_blank"
              rel="noreferrer"
              className="text-fish-dark underline decoration-fish-primary/40 underline-offset-4 hover:text-fish-primary"
            >
              тут
            </a>.
          </p>
          <div className="mt-6 rounded-3xl bg-fish-light p-5 font-extrabold text-fish-dark">
            Якщо скинути локальний прогрес або очистити дані браузера, уроки на цьому пристрої почнуться спочатку. Прогрес у коді доступу можна видалити окремо.
          </div>
        </aside>
      </section>

      {showUnlockWindow ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/35 p-4 sm:p-8" role="dialog" aria-modal="true" aria-labelledby="unlock-title">
          <div className="fish-card max-h-[90vh] max-w-md overflow-y-auto p-5 text-center sm:p-7">
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-green-50 text-fish-success">
              <CheckCircle2 size={34} aria-hidden />
            </div>
            <h2 id="unlock-title" className="text-2xl font-extrabold text-fish-text sm:text-3xl">
              Усі уроки відкрито
            </h2>
            <p className="mt-3 text-base font-bold leading-relaxed text-fish-muted sm:text-lg">
              Фішко розблокував усі уроки на карті. Можна проходити їх у будь-якому порядку.
            </p>
            <button onClick={() => setShowUnlockWindow(false)} className="chunky-primary mt-6">
              Готово
            </button>
          </div>
        </div>
      ) : null}

      {showResetConfirm ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/35 p-4 sm:p-8" role="dialog" aria-modal="true" aria-labelledby="reset-title">
          <div className="fish-card max-h-[90vh] max-w-lg overflow-y-auto p-5 sm:p-7">
            <div className="mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-red-50 text-fish-danger">
              <RotateCcw size={32} aria-hidden />
            </div>
            <h2 id="reset-title" className="text-2xl font-extrabold text-fish-text sm:text-3xl">
              Скинути прогрес?
            </h2>
            <p className="mt-3 text-base font-bold leading-relaxed text-fish-muted sm:text-lg">
              Це закриє пройдені уроки, прибере зірки, серію та результати. Дані буде очищено тільки у цьому браузері.
            </p>
            <div className="mt-7 flex flex-col justify-end gap-3 sm:flex-row">
              <button onClick={() => setShowResetConfirm(false)} className="chunky-secondary w-full sm:w-auto">
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

      {showRegenerateConfirm ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/35 p-4 sm:p-8" role="dialog" aria-modal="true" aria-labelledby="regenerate-access-title">
          <div className="fish-card max-h-[90vh] max-w-lg overflow-y-auto p-5 sm:p-7">
            <div className="mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-amber-50 text-fish-warning">
              <KeyRound size={32} aria-hidden />
            </div>
            <h2 id="regenerate-access-title" className="text-2xl font-extrabold text-fish-text sm:text-3xl">
              Згенерувати новий код?
            </h2>
            <p className="mt-3 text-base font-bold leading-relaxed text-fish-muted sm:text-lg">
              Старий код перестане працювати. Новий код буде показано лише один раз. Продовжити?
            </p>
            <p className="mt-3 rounded-2xl bg-fish-light p-4 font-bold leading-relaxed text-fish-text">
              Якщо ви втратите новий код доступу, відновити цей акаунт буде неможливо, бо код не зберігається у відкритому вигляді.
            </p>
            <div className="mt-7 flex flex-col justify-end gap-3 sm:flex-row">
              <button onClick={() => setShowRegenerateConfirm(false)} className="chunky-secondary w-full sm:w-auto">
                Скасувати
              </button>
              <button
                onClick={regenerateAccessCode}
                disabled={loadingAction === "regenerate"}
                className="chunky-primary w-full disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none sm:w-auto"
              >
                Так, створити новий код
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showDeleteAccountConfirm ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/35 p-4 sm:p-8" role="dialog" aria-modal="true" aria-labelledby="delete-access-title">
          <div className="fish-card max-h-[90vh] max-w-lg overflow-y-auto p-5 sm:p-7">
            <div className="mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-red-50 text-fish-danger">
              <Trash2 size={32} aria-hidden />
            </div>
            <h2 id="delete-access-title" className="text-2xl font-extrabold text-fish-text sm:text-3xl">
              Видалити код доступу?
            </h2>
            <p className="mt-3 text-base font-bold leading-relaxed text-fish-muted sm:text-lg">
              Код перестане працювати на всіх пристроях, а збережений у Supabase прогрес буде видалено. Локальний прогрес у цьому браузері залишиться.
            </p>
            <div className="mt-7 flex flex-col justify-end gap-3 sm:flex-row">
              <button onClick={() => setShowDeleteAccountConfirm(false)} className="chunky-secondary w-full sm:w-auto">
                Скасувати
              </button>
              <button
                onClick={deleteAccessAccount}
                disabled={loadingAction === "delete"}
                className="chunky-primary bg-fish-danger shadow-[0_5px_0_#B91C1C] hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                Так, видалити
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function notifyAutoSync(loggedIn: boolean) {
  window.dispatchEvent(new CustomEvent("spot-the-fish-sync-session", { detail: { loggedIn } }));
}

function SettingBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-fish-border bg-white p-4 sm:rounded-[26px] sm:p-6">
      <h2 className="mb-4 text-xl font-extrabold text-fish-text sm:text-2xl">{title}</h2>
      {children}
    </section>
  );
}
