import lessons from "@/data/lessons.json";
import { Lesson } from "./types";

export const allLessons = [...(lessons as Lesson[])].sort((a, b) => a.order - b.order);

export const lessonModules = [
  { id: "messages", title: "Підозрілі повідомлення" },
  { id: "links-sites", title: "Посилання і сайти" },
  { id: "services", title: "Популярні сервіси" },
  { id: "safe-actions", title: "Безпечні дії" },
];

export function getLesson(lessonId: string) {
  return allLessons.find((lesson) => lesson.id === lessonId) ?? null;
}

export function getNextLessonId(lessonId: string) {
  const current = getLesson(lessonId);
  if (!current) return null;
  return allLessons.find((lesson) => lesson.order === current.order + 1)?.id ?? null;
}
