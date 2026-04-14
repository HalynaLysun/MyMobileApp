import { TestAnswersMap } from "@/types/user";

/**
 * Розрахунок відсотка співпадіння між двома користувачами
 */
export default function calculateMatchPercentage(
  answers1?: TestAnswersMap,
  answers2?: TestAnswersMap,
): number {
  // Якщо хтось не пройшов тест, матч 0%
  if (!answers1 || !answers2) return 0;

  let totalScore = 0;
  const questionKeys = Object.keys(answers1) as (keyof TestAnswersMap)[];

  if (questionKeys.length === 0) return 0;

  questionKeys.forEach((key) => {
    const listA = answers1[key] || [];
    const listB = answers2[key] || [];

    if (listA.length === 0 || listB.length === 0) return;

    // Рахуємо перетин (спільні елементи)
    const intersection = listA.filter((x) => listB.includes(x));

    // Рахуємо об'єднання (унікальні елементи з обох списків)
    const union = Array.from(new Set([...listA, ...listB]));

    if (union.length > 0) {
      totalScore += intersection.length / union.length;
    }
  });

  // Повертаємо середнє арифметичне у відсотках
  return Math.round((totalScore / questionKeys.length) * 100);
}
