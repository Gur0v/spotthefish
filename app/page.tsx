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
      <section className="mx-auto grid max-w-[1160px] grid-cols-1 items-center gap-6 lg:min-h-[560px] lg:grid-cols-[1.02fr_0.98fr] lg:gap-8">
        <div className="pr-0 lg:pr-2">
          <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-fish-border bg-white px-4 py-2.5 font-extrabold text-fish-dark lg:mb-7 lg:px-5 lg:py-3">
            <ShieldCheck size={21} aria-hidden />
            Фішко допомагає перевіряти повідомлення
          </div>
          <h1 className="max-w-none text-4xl font-extrabold leading-tight tracking-normal text-fish-text sm:text-5xl lg:max-w-[620px] lg:text-[58px] lg:leading-[1.04]">
            Розпізнавайте онлайн-шахраїв
            <span className="lg:block"> через короткі ігри</span>
          </h1>
          <p className="mt-4 max-w-none text-lg font-semibold leading-relaxed text-fish-muted sm:text-xl lg:mt-6 lg:max-w-[590px]">
            Spot the Fish вчить помічати підозрілі повідомлення, фейкові посилання та прохання про гроші без реєстрації.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center lg:mt-8 lg:gap-4">
            <Link href="/learn" className="chunky-primary w-full text-lg sm:w-auto">
              Почати гру
              <ArrowRight size={22} aria-hidden />
            </Link>
            <Link href="/lesson/urgent" className="chunky-secondary w-full text-lg sm:w-auto">
              <Play size={21} aria-hidden />
              Спробувати приклад
            </Link>
          </div>
          <p className="mt-5 max-w-none rounded-2xl border border-fish-border bg-white px-4 py-3 text-sm font-bold text-fish-muted sm:text-base lg:mt-7 lg:max-w-xl lg:rounded-3xl lg:px-5 lg:py-4">
            Без пошти, паролів і збору особистих даних. Прогрес зберігається у браузері або у приватному коді доступу, якщо ви самі ввімкнете синхронізацію.
            <a
              href="https://github.com/Gur0v/spotthefish"
              target="_blank"
              rel="noreferrer"
              className="ml-1 text-fish-dark underline decoration-fish-primary/40 underline-offset-4 hover:text-fish-primary"
            >
              Код сайту відкритий.
            </a>
          </p>
        </div>
        <LessonPreview />
      </section>

      <section className="mx-auto mt-5 grid max-w-[1160px] grid-cols-1 gap-4 sm:grid-cols-3 lg:mt-2 lg:gap-5">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <article key={step.title} className="fish-card flex items-start gap-4 p-4 sm:p-5">
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
    <aside className="fish-card relative overflow-hidden p-4 sm:p-6">
      <div className="absolute inset-x-0 top-0 h-24 bg-fish-light" />
      <div className="relative">
        <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-fish-dark ring-1 ring-fish-border">
              <Search size={17} aria-hidden />
              Спробуйте знайти пастку
            </div>
            <p className="mt-2 text-sm font-bold text-fish-muted sm:mt-3 sm:text-base">Мініурок 1 з карти навчання</p>
          </div>
          <Fishko className="-my-6 h-28 w-28 shrink-0 sm:-my-10 sm:h-44 sm:w-44" />
        </div>

        <div className="rounded-2xl border-2 border-fish-border bg-white p-4 shadow-soft sm:rounded-[26px] sm:p-5">
          <div className="mb-4 flex items-center justify-between border-b border-fish-border pb-3">
            <div>
              <div className="text-sm font-bold text-fish-muted">Відправник</div>
              <div className="text-lg font-extrabold text-fish-text">Bank24 Secure</div>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-fish-muted">09:41</div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 sm:rounded-3xl sm:p-5">
            <p className="text-base font-bold leading-relaxed text-fish-text sm:text-lg">
              Вашу картку буде заблоковано сьогодні. Підтвердьте особисті дані за посиланням:
            </p>
            <button className="mt-4 max-w-full break-all rounded-2xl border-2 border-fish-danger bg-red-50 px-4 py-3 text-left font-extrabold text-fish-danger">
              bank24-secure-login.com
            </button>
          </div>

          <div className="mt-5 rounded-2xl bg-fish-light p-4 sm:rounded-3xl">
            <div className="mb-3 font-extrabold text-fish-dark">Фішко помітив 3 сигнали:</div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[0.82fr_1.15fr_1.18fr]">
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
