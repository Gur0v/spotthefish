import { readFileSync, writeFileSync } from "node:fs";

const path = new URL("../data/lessons.json", import.meta.url);
const lessons = JSON.parse(readFileSync(path, "utf8"));

const configs = {
  urgent: {
    sender: "Bank24",
    service: "банку",
    official: "https://bank24.ua",
    fake: "bank24-card-alert.site",
    request: "підтвердити дані картки",
    safe: "відкрити застосунок банку самостійно",
    category: "термінове блокування",
  },
  "fake-support": {
    sender: "Підтримка Сервіс+",
    service: "служби підтримки",
    official: "https://support.servisplus.ua",
    fake: "support-secure-chat.click",
    request: "надіслати код і показати екран",
    safe: "створити звернення в офіційному застосунку",
    category: "фейкова підтримка",
  },
  "sms-codes": {
    sender: "Код підтвердження",
    service: "акаунта",
    official: "Офіційний застосунок сервісу",
    fake: "code-check-helper.net",
    request: "продиктувати SMS-код",
    safe: "нікому не повідомляти код",
    category: "одноразовий код",
  },
  giveaways: {
    sender: "Подарунок Онлайн",
    service: "розіграшу",
    official: "https://familyclub.ua/news",
    fake: "gift-win-pay.top",
    request: "сплатити комісію за приз",
    safe: "перевірити розіграш на офіційному сайті",
    category: "фейковий приз",
  },
  links: {
    sender: "ДержПослуги",
    service: "державного сервісу",
    official: "https://derzhposlugy.ua",
    fake: "derzhposlugy-login.safe-user.info",
    request: "увійти через посилання",
    safe: "ввести адресу сервісу вручну",
    category: "підозрілий домен",
  },
  "fake-sites": {
    sender: "Bank24 Online",
    service: "сайту банку",
    official: "https://bank24.ua/login",
    fake: "bank24.ua.restore-client.center",
    request: "ввести пароль на схожій сторінці",
    safe: "закрити сторінку і зайти через офіційний сайт",
    category: "підроблена сторінка",
  },
  "qr-payments": {
    sender: "Покупець",
    service: "QR-оплати",
    official: "Оплата у застосунку платформи",
    fake: "qr-pay-client.click",
    request: "сканувати QR і ввести картку",
    safe: "перевірити оплату всередині платформи",
    category: "QR-код",
  },
  "account-login": {
    sender: "Безпека акаунта",
    service: "сторінки входу",
    official: "https://account.servis.ua/login",
    fake: "account-login-restore.top",
    request: "ввести пароль після SMS",
    safe: "відкрити застосунок або сайт самостійно",
    category: "вхід в акаунт",
  },
  olx: {
    sender: "Покупець OLX",
    service: "OLX-продажу",
    official: "Оформлення в акаунті OLX",
    fake: "olx-safe-pay-client.com",
    request: "ввести картку для отримання грошей",
    safe: "залишитися в чаті OLX і не вводити CVV",
    category: "продаж товару",
  },
  telegram: {
    sender: "Друг у Telegram",
    service: "Telegram",
    official: "Перевірка через дзвінок другу",
    fake: "telegram-vote-gift.site",
    request: "увійти за кодом для голосування",
    safe: "перевірити друга іншим каналом",
    category: "месенджер",
  },
  viber: {
    sender: "Viber-розсилка",
    service: "Viber",
    official: "Офіційний застосунок сервісу",
    fake: "viber-help-pay.info",
    request: "заповнити картку для компенсації",
    safe: "перевірити новину на офіційному сайті",
    category: "груповий чат",
  },
  delivery: {
    sender: "Швидка Пошта",
    service: "доставки",
    official: "https://shvydkaposhta.ua/track",
    fake: "shvydka-fee-pay.click",
    request: "доплатити невелику суму за посиланням",
    safe: "перевірити трек-номер у застосунку",
    category: "посилка",
  },
  banking: {
    sender: "Bank24 Безпека",
    service: "банківської операції",
    official: "Номер з картки або застосунок Bank24",
    fake: "bank24-safe-reserve.info",
    request: "переказати гроші на резервний рахунок",
    safe: "завершити дзвінок і подзвонити в банк самостійно",
    category: "банківська дія",
  },
  relative: {
    sender: "Новий номер",
    service: "родинного прохання",
    official: "Дзвінок на старий номер родича",
    fake: "family-help-pay.click",
    request: "терміново переказати гроші",
    safe: "перевірити голосом або через іншого родича",
    category: "прохання грошей",
  },
  "safe-verification": {
    sender: "Невідомий сервіс",
    service: "перевірки",
    official: "Офіційний сайт або застосунок",
    fake: "verify-now-fast.top",
    request: "натиснути посилання і діяти негайно",
    safe: "зробити паузу і перевірити через офіційний канал",
    category: "алгоритм перевірки",
  },
  final: {
    sender: "Змішаний виклик",
    service: "фінальної перевірки",
    official: "Офіційний канал сервісу",
    fake: "secure-client-final.click",
    request: "передати код, гроші або пароль",
    safe: "пауза, перевірка, офіційний канал",
    category: "змішана пастка",
  },
};

function spot(id, c, variant) {
  return {
    id,
    type: "spot-red-flags",
    prompt: "Позначте всі підозрілі частини повідомлення.",
    messageParts: [
      { id: "p1", text: `${c.sender}: `, isFlag: false },
      {
        id: "p2",
        text: variant === 1 ? "дія потрібна негайно, інакше доступ буде обмежено. " : "не закривайте чат і виконайте інструкцію зараз. ",
        isFlag: true,
        explanation: "Поспіх і тиск заважають спокійно перевірити повідомлення.",
      },
      {
        id: "p3",
        text: `Потрібно ${c.request}. `,
        isFlag: true,
        explanation: "Прохання стосується даних, грошей, коду або входу і потребує перевірки.",
      },
      {
        id: "p4",
        text: c.fake,
        isFlag: true,
        explanation: "Адреса або канал не схожі на офіційний спосіб взаємодії.",
      },
    ],
    requiredFlags: ["p2", "p3", "p4"],
    successFeedback: "Правильно. Ви помітили тиск, небезпечне прохання і підозрілий канал.",
    failureFeedback: "Зверніть увагу на поспіх, прохання про дію і адресу або канал повідомлення.",
    rule: `Для теми '${c.category}' безпечніше ${c.safe}.`,
  };
}

function safe(id, c, variant) {
  return {
    id,
    type: "safe-action",
    scenario:
      variant === 1
        ? `Ви отримали повідомлення від '${c.sender}', де просять ${c.request}. Повідомлення звучить терміново.`
        : `Людина в чаті наполягає, що для ${c.service} треба ${c.request}, і просить не витрачати час на перевірку.`,
    question: "Яка дія найбезпечніша?",
    options: [
      { id: "a", text: "Виконати прохання, якщо повідомлення виглядає знайомо." },
      { id: "b", text: c.safe.charAt(0).toUpperCase() + c.safe.slice(1) + "." },
      { id: "c", text: "Відповісти в чаті й попросити надіслати ще одне посилання." },
      { id: "d", text: "Спробувати дію, але не розповідати про це нікому." },
    ],
    correctOptionId: "b",
    successFeedback: "Правильно. Ви обрали перевірку без взаємодії з підозрілим проханням.",
    failureFeedback: "Не зовсім. Найбезпечніше прибрати поспіх і перевірити через незалежний канал.",
    rule: `Коли є сумнів, не продовжуйте шлях із повідомлення. Краще ${c.safe}.`,
  };
}

function realOrFake(id, c, variant) {
  return {
    id,
    type: "real-or-fake",
    prompt: variant === 1 ? "Оберіть підозріле повідомлення." : "Оберіть безпечніший варіант.",
    options:
      variant === 1
        ? [
            { id: "a", label: "А", content: `${c.sender}: перевірте інформацію через офіційний канал. Ніяких кодів або карткових даних у чаті не потрібно.` },
            { id: "b", label: "Б", content: `${c.sender}: щоб завершити ${c.service}, потрібно ${c.request}. Перейдіть сюди: ${c.fake}` },
          ]
        : [
            { id: "a", label: "А", content: `Зробити паузу і ${c.safe}.` },
            { id: "b", label: "Б", content: `Довіритися повідомленню, бо воно згадує ${c.service} і виглядає переконливо.` },
          ],
    correctOptionId: variant === 1 ? "b" : "a",
    successFeedback: "Правильно. Ви відрізнили офіційну перевірку від небезпечного прохання.",
    failureFeedback: "Не зовсім. Підозрілий варіант веде до дії через чужий канал або просить приватні дані.",
    rule: `Назва сервісу в повідомленні не є доказом. Перевіряйте через офіційний шлях.`,
  };
}

function link(id, c, variant) {
  return {
    id,
    type: "link-check",
    prompt: variant === 1 ? "Оберіть найбезпечніший варіант." : "Оберіть найризикованіший варіант.",
    urls:
      variant === 1
        ? [
            { id: "a", text: c.official },
            { id: "b", text: c.fake },
            { id: "c", text: `https://secure-${c.fake}` },
            { id: "d", text: "Скорочене посилання з повідомлення" },
          ]
        : [
            { id: "a", text: c.safe },
            { id: "b", text: "Перевірка через офіційний застосунок" },
            { id: "c", text: `${c.fake} з терміновим проханням` },
            { id: "d", text: "Дзвінок на офіційний номер підтримки" },
          ],
    correctUrlId: variant === 1 ? "a" : "c",
    successFeedback: "Правильно. Ви звернули увагу на канал і адресу, а не тільки на знайомі слова.",
    failureFeedback: "Не зовсім. Ризиковий варіант використовує чужий домен, скорочення або терміновість.",
    rule: "Безпечна перевірка починається з офіційного каналу, а не з посилання у повідомленні.",
  };
}

function makeQuestions(lessonId) {
  const c = configs[lessonId];
  if (!c) throw new Error(`Missing config for ${lessonId}`);
  return [
    spot(`${lessonId}-extra-1`, c, 1),
    safe(`${lessonId}-extra-2`, c, 1),
    realOrFake(`${lessonId}-extra-3`, c, 1),
    link(`${lessonId}-extra-4`, c, 1),
    spot(`${lessonId}-extra-5`, c, 2),
    safe(`${lessonId}-extra-6`, c, 2),
    realOrFake(`${lessonId}-extra-7`, c, 2),
    link(`${lessonId}-extra-8`, c, 2),
    {
      id: `${lessonId}-extra-9`,
      type: "safe-action",
      scenario: `Ви майже повірили повідомленню про ${c.service}, але помітили незнайому адресу або дивне прохання.`,
      question: "Що варто зробити перед будь-якою дією?",
      options: [
        { id: "a", text: "Зробити скриншот, нічого не вводити і перевірити через офіційний канал." },
        { id: "b", text: "Натиснути посилання, щоб переконатися." },
        { id: "c", text: "Ввести неповні дані для перевірки." },
        { id: "d", text: "Попросити шахрая підтвердити, що він не шахрай." },
      ],
      correctOptionId: "a",
      successFeedback: "Правильно. Скриншот і пауза допомагають перевірити ситуацію без ризику.",
      failureFeedback: "Зверніть увагу: не треба взаємодіяти з підозрілим повідомленням, щоб його перевірити.",
      rule: "Пауза, скриншот і офіційний канал - безпечна трійка для перевірки.",
    },
    {
      id: `${lessonId}-extra-10`,
      type: "real-or-fake",
      prompt: "Оберіть фразу, яка звучить як корисне правило.",
      options: [
        { id: "a", label: "А", content: `Якщо повідомлення просить ${c.request}, спершу треба ${c.safe}.` },
        { id: "b", label: "Б", content: "Якщо повідомлення термінове, краще діяти швидко і не витрачати час." },
      ],
      correctOptionId: "a",
      successFeedback: "Правильно. Безпечна дія починається з перевірки, а не з поспіху.",
      failureFeedback: "Не зовсім. Поспіх - один з найчастіших інструментів шахраїв.",
      rule: `Для теми '${c.category}' головне правило: ${c.safe}.`,
    },
  ];
}

for (const lesson of lessons) {
  const existing = new Set(lesson.questions.map((question) => question.id));
  const additions = makeQuestions(lesson.id).filter((question) => !existing.has(question.id));
  lesson.questions.push(...additions);
}

writeFileSync(path, `${JSON.stringify(lessons, null, 2)}\n`);
