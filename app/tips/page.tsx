import { BadgeAlert, Banknote, KeyRound, LinkIcon, Package, ShoppingBag, Users } from "lucide-react";

const sections = [
  {
    title: "Банківські повідомлення",
    icon: Banknote,
    tips: ["Банк не просить SMS-коди, PIN або CVV.", "Перевіряйте проблеми з карткою у застосунку.", "Не переказуйте гроші на 'безпечний рахунок'."],
  },
  {
    title: "Підозрілі посилання",
    icon: LinkIcon,
    tips: ["Дивіться на головний домен перед .ua або .com.", "Уникайте скорочених посилань у фінансових діях.", "Слова secure і verify не роблять сайт безпечним."],
  },
  {
    title: "Прохання про гроші",
    icon: Users,
    tips: ["Новий номер треба перевірити дзвінком.", "Поставте особисте питання, відповідь на яке знає тільки близька людина.", "Не переказуйте гроші під тиском провини або поспіху."],
  },
  {
    title: "Доставка і посилки",
    icon: Package,
    tips: ["Оплату доставки перевіряйте в офіційному застосунку.", "Мала сума може бути приманкою для картки.", "Не вводьте картку після SMS з невідомим посиланням."],
  },
  {
    title: "Маркетплейси",
    icon: ShoppingBag,
    tips: ["Не виходьте у сторонні чати для оплати.", "Покупцю не потрібен ваш SMS-код.", "Отримання грошей не вимагає CVV."],
  },
  {
    title: "Коди підтвердження",
    icon: KeyRound,
    tips: ["Код з SMS призначений тільки для вас.", "Підтримка не просить код телефоном.", "Якщо код прийшов неочікувано, не називайте його нікому."],
  },
];

export default function TipsPage() {
  return (
    <div className="desktop-wrap">
      <div className="mb-5 flex flex-col gap-3 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-extrabold text-fish-dark">Бібліотека безпеки</p>
          <h1 className="text-3xl font-extrabold text-fish-text sm:text-5xl">Практичні поради</h1>
        </div>
        <div className="rounded-2xl border border-fish-border bg-white px-4 py-3 font-bold text-fish-muted sm:rounded-3xl sm:px-5 sm:py-4">
          Без жаргону. Тільки звички, які працюють.
        </div>
      </div>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <article key={section.title} className="fish-card p-4 transition sm:p-6 lg:min-h-[260px] lg:hover:-translate-y-1 lg:hover:shadow-soft">
              <div className="mb-4 flex items-center gap-3 sm:mb-5">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-fish-light text-fish-dark">
                  <Icon size={24} aria-hidden />
                </div>
                <h2 className="text-xl font-extrabold text-fish-text sm:text-2xl">{section.title}</h2>
              </div>
              <ul className="space-y-3">
                {section.tips.map((tip) => (
                  <li key={tip} className="flex gap-3 font-bold leading-relaxed text-fish-text">
                    <BadgeAlert className="mt-1 shrink-0 text-fish-primary" size={18} aria-hidden />
                    {tip}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </section>
    </div>
  );
}
