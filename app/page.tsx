import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle, MousePointerClick, Play, Search, ShieldCheck } from "lucide-react";
import { Fishko } from "@/components/Fishko";

export default function HomePage() {
  const steps = [
    {
      title: "Читайте приклад",
      text: "Коротке повідомлення схоже на те, що може прийти у SMS або месенджері.",
      icon: MessageCircle,
    },
    {
      title: "Знаходьте підозрілі деталі",
      text: "Натискайте на слова, посилання й прохання, які варто перевірити.",
      icon: MousePointerClick,
    },
    {
      title: "Дізнавайтеся безпечну дію",
      text: "Після відповіді Фішко пояснює просте правило без жаргону.",
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="desktop-wrap">
      <section className="mx-auto grid min-h-[560px] max-w-[1160px] grid-cols-[1.02fr_0.98fr] items-center gap-8">
        <div className="pr-2">
          <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-fish-border bg-white px-5 py-3 font-extrabold text-fish-dark">
            <ShieldCheck size={21} aria-hidden />
            Фішко допомагає перевіряти повідомлення
          </div>
          <h1 className="max-w-[620px] text-[58px] font-extrabold leading-[1.04] tracking-normal text-fish-text">
            Розпізнавайте онлайн-шахраїв
            <span className="block">через короткі ігри</span>
          </h1>
          <p className="mt-6 max-w-[590px] text-xl font-semibold leading-relaxed text-fish-muted">
            Spot the Fish вчить помічати підозрілі повідомлення, фейкові посилання та прохання про гроші без реєстрації.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link href="/learn" className="chunky-primary text-lg">
              Почати гру
              <ArrowRight size={22} aria-hidden />
            </Link>
            <Link href="/lesson/urgent" className="chunky-secondary text-lg">
              <Play size={21} aria-hidden />
              Спробувати приклад
            </Link>
          </div>
          <p className="mt-7 max-w-xl rounded-3xl border border-fish-border bg-white px-5 py-4 text-base font-bold text-fish-muted">
            Без реєстрації. Без збору особистих даних. Прогрес зберігається тільки у вашому браузері.
          </p>
        </div>
        <LessonPreview />
      </section>

      <section className="mx-auto mt-2 grid max-w-[1160px] grid-cols-3 gap-5">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <article key={step.title} className="fish-card flex items-start gap-4 p-5">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-fish-light text-fish-dark">
                <Icon size={23} aria-hidden />
              </div>
              <div>
                <div className="mb-1 text-sm font-extrabold text-fish-primary">Крок {index + 1}</div>
                <h2 className="text-xl font-extrabold text-fish-text">{step.title}</h2>
                <p className="mt-1 font-semibold leading-relaxed text-fish-muted">{step.text}</p>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

function LessonPreview() {
  const signals = ["поспіх", "підозрілий домен", "прохання про дані"];

  return (
    <aside className="fish-card relative overflow-hidden p-6">
      <div className="absolute inset-x-0 top-0 h-24 bg-fish-light" />
      <div className="relative">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-fish-dark ring-1 ring-fish-border">
              <Search size={17} aria-hidden />
              Спробуйте знайти пастку
            </div>
            <p className="mt-3 font-bold text-fish-muted">Мініурок 1 з карти навчання</p>
          </div>
          <Fishko className="-my-10 h-44 w-44 shrink-0" />
        </div>

        <div className="rounded-[26px] border-2 border-fish-border bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between border-b border-fish-border pb-3">
            <div>
              <div className="text-sm font-bold text-fish-muted">Відправник</div>
              <div className="text-lg font-extrabold text-fish-text">Bank24 Secure</div>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-fish-muted">09:41</div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-lg font-bold leading-relaxed text-fish-text">
              Вашу картку буде заблоковано сьогодні. Підтвердьте особисті дані за посиланням:
            </p>
            <button className="mt-4 rounded-2xl border-2 border-fish-danger bg-red-50 px-4 py-3 text-left font-extrabold text-fish-danger">
              bank24-secure-login.com
            </button>
          </div>

          <div className="mt-5 rounded-3xl bg-fish-light p-4">
            <div className="mb-3 font-extrabold text-fish-dark">Фішко помітив 3 сигнали:</div>
            <div className="grid grid-cols-[0.82fr_1.15fr_1.18fr] gap-2">
              {signals.map((signal) => (
                <div key={signal} className="flex min-h-11 items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-bold leading-tight text-fish-text ring-1 ring-fish-border">
                  <span className="h-2.5 w-2.5 rounded-full bg-fish-warning" aria-hidden />
                  {signal}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
