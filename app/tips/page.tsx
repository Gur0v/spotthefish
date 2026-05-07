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
      <div className="mb-7 flex items-end justify-between">
        <div>
          <p className="font-extrabold text-fish-dark">Бібліотека безпеки</p>
          <h1 className="text-5xl font-extrabold text-fish-text">Практичні поради</h1>
        </div>
        <div className="rounded-3xl border border-fish-border bg-white px-5 py-4 font-bold text-fish-muted">
          Без жаргону. Тільки звички, які працюють.
        </div>
      </div>
      <section className="grid grid-cols-3 gap-5">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <article key={section.title} className="fish-card min-h-[260px] p-6 transition hover:-translate-y-1 hover:shadow-soft">
              <div className="mb-5 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-fish-light text-fish-dark">
                  <Icon size={24} aria-hidden />
                </div>
                <h2 className="text-2xl font-extrabold text-fish-text">{section.title}</h2>
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
