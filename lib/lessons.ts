import lessonMeta from "@/data/lessonMeta.json";
import { LessonMeta } from "./types";

export const allLessons = [...(lessonMeta as LessonMeta[])].sort((a, b) => a.order - b.order);

export const lessonModules = [
  { id: "messages", title: "Підозрілі повідомлення" },
  { id: "links-sites", title: "Посилання і сайти" },
  { id: "services", title: "Популярні сервіси" },
  { id: "safe-actions", title: "Безпечні дії" },
];

export function getLessonMeta(lessonId: string) {
  return allLessons.find((lesson) => lesson.id === lessonId) ?? null;
}

export function getNextLessonId(lessonId: string) {
  const current = getLessonMeta(lessonId);
  if (!current) return null;
  return allLessons.find((lesson) => lesson.order === current.order + 1)?.id ?? null;
}
