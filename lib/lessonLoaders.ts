import { Lesson } from "./types";

type LessonModule = { default: unknown };
type LessonLoader = () => Promise<LessonModule>;

const lessonLoaders = {
  "account-login": () => import("@/data/lessons/account-login.json"),
  banking: () => import("@/data/lessons/banking.json"),
  delivery: () => import("@/data/lessons/delivery.json"),
  "fake-sites": () => import("@/data/lessons/fake-sites.json"),
  "fake-support": () => import("@/data/lessons/fake-support.json"),
  final: () => import("@/data/lessons/final.json"),
  giveaways: () => import("@/data/lessons/giveaways.json"),
  links: () => import("@/data/lessons/links.json"),
  olx: () => import("@/data/lessons/olx.json"),
  "qr-payments": () => import("@/data/lessons/qr-payments.json"),
  relative: () => import("@/data/lessons/relative.json"),
  "safe-verification": () => import("@/data/lessons/safe-verification.json"),
  "sms-codes": () => import("@/data/lessons/sms-codes.json"),
  telegram: () => import("@/data/lessons/telegram.json"),
  urgent: () => import("@/data/lessons/urgent.json"),
  viber: () => import("@/data/lessons/viber.json"),
} satisfies Record<string, LessonLoader>;

export function hasLessonLoader(lessonId: string) {
  return lessonId in lessonLoaders;
}

export async function loadLesson(lessonId: string): Promise<Lesson | null> {
  const loader = lessonLoaders[lessonId as keyof typeof lessonLoaders];
  if (!loader) return null;
  const module = await loader();
  return module.default as Lesson;
}

export function preloadLesson(lessonId: string) {
  const loader = lessonLoaders[lessonId as keyof typeof lessonLoaders];
  if (loader) void loader();
}
