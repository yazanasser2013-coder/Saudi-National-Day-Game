import type { Question } from "../types/game";

export const EASY_POOL: Question[] = [
  {
    id: "Q01",
    question: "في أي يوم يُحتفل باليوم الوطني السعودي؟",
    answers: ["21 سبتمبر", "23 سبتمبر", "25 سبتمبر", "27 سبتمبر"],
    correctAnswer: 1,
    difficulty: "easy",
    phase: 1,
    timeLimit: 15,
    basePoints: 100,
    type: "multiple-choice",
  },
  {
    id: "Q02",
    question: "من هو مؤسس المملكة العربية السعودية؟",
    answers: [
      "الملك فهد بن عبدالعزيز",
      "الملك عبدالعزيز بن عبدالرحمن آل سعود",
      "الملك عبدالله بن عبدالعزيز",
      "الملك سلمان بن عبدالعزيز",
    ],
    correctAnswer: 1,
    difficulty: "easy",
    phase: 1,
    timeLimit: 15,
    basePoints: 200,
    type: "multiple-choice",
  },
  {
    id: "Q03",
    question: "ما هي عاصمة المملكة العربية السعودية؟",
    answers: ["جدة", "مكة المكرمة", "الرياض", "المدينة المنورة"],
    correctAnswer: 2,
    difficulty: "easy",
    phase: 1,
    timeLimit: 15,
    basePoints: 300,
    type: "multiple-choice",
  },
  {
    id: "Q04",
    question: "ما هو اسم العلم السعودي؟",
    answers: ["علم التوحيد", "علم الشهادة", "العلم الأخضر", "علم السيف"],
    correctAnswer: 0,
    difficulty: "easy",
    phase: 1,
    timeLimit: 15,
    basePoints: 400,
    type: "multiple-choice",
  },
  {
    id: "Q05",
    question: "في أي عام تأسست المملكة العربية السعودية رسمياً؟",
    answers: ["1928", "1930", "1932", "1934"],
    correctAnswer: 2,
    difficulty: "easy",
    phase: 1,
    timeLimit: 15,
    basePoints: 500,
    type: "multiple-choice",
  },
];

export const MEDIUM_HARD_POOL: Question[] = [
  {
    id: "Q06",
    question: "ما هو اسم أول دستور للمملكة العربية السعودية؟",
    answers: [
      "النظام الأساسي للحكم",
      "نظام الحكم",
      "الدستور السعودي",
      "نظام الدولة",
    ],
    correctAnswer: 0,
    difficulty: "medium",
    phase: 2,
    timeLimit: 15,
    basePoints: 500,
    type: "multiple-choice",
  },
  {
    id: "Q07",
    question: "كم عدد المناطق الإدارية في المملكة العربية السعودية حالياً؟",
    answers: ["11 منطقة", "13 منطقة", "15 منطقة", "17 منطقة"],
    correctAnswer: 1,
    difficulty: "medium",
    phase: 2,
    timeLimit: 15,
    basePoints: 625,
    type: "multiple-choice",
  },
  {
    id: "Q08",
    question: "ما هو أطول نهر في المملكة العربية السعودية؟",
    answers: ["لا توجد أنهار دائمة", "وادي حنيفة", "وادي الرمة", "نهر النيل"],
    correctAnswer: 0,
    difficulty: "hard",
    phase: 2,
    timeLimit: 15,
    basePoints: 750,
    type: "multiple-choice",
  },
  {
    id: "Q09",
    question: "ما هي العملة الرسمية للمملكة العربية السعودية؟",
    answers: [
      "الريال السعودي",
      "الدينار السعودي",
      "الجنيه السعودي",
      "الدرهم السعودي",
    ],
    correctAnswer: 0,
    difficulty: "medium",
    phase: 2,
    timeLimit: 15,
    basePoints: 875,
    type: "multiple-choice",
  },
  {
    id: "Q10",
    question:
      'من هو الملك الذي أصدر قرار توحيد المملكة باسم "المملكة العربية السعودية"؟',
    answers: ["الملك سعود", "الملك فيصل", "الملك عبدالعزيز", "الملك خالد"],
    correctAnswer: 2,
    difficulty: "hard",
    phase: 2,
    timeLimit: 15,
    basePoints: 1000,
    type: "multiple-choice",
  },
];

export const FINAL_POOL: Question[] = [
  {
    id: "Q11",
    question:
      "ما هو اسم المعركة التي خاضها الملك عبدالعزيز لاستعادة الرياض عام 1902م؟",
    answers: ["معركة الرياض", "معركة الشنانة", "معركة جراب", "معركة البكيرية"],
    correctAnswer: 0,
    difficulty: "extreme",
    phase: 3,
    timeLimit: 10,
    basePoints: 1000,
    type: "multiple-choice",
  },
  {
    id: "Q12",
    question: "في أي عام تم إعلان نظام المناطق الإدارية في المملكة؟",
    answers: ["1990", "1992", "1994", "1996"],
    correctAnswer: 1,
    difficulty: "extreme",
    phase: 3,
    timeLimit: 10,
    basePoints: 1250,
    type: "multiple-choice",
  },
  {
    id: "Q13",
    question: "ما هو اسم أول جامعة تأسست في المملكة العربية السعودية؟",
    answers: [
      "جامعة الملك سعود",
      "جامعة الإمام محمد بن سعود",
      "جامعة الملك عبدالعزيز",
      "جامعة أم القرى",
    ],
    correctAnswer: 0,
    difficulty: "extreme",
    phase: 3,
    timeLimit: 10,
    basePoints: 1500,
    type: "multiple-choice",
  },
  {
    id: "Q14",
    question:
      "كم عدد الدول التي تشترك في الحدود البرية مع المملكة العربية السعودية؟",
    answers: ["6 دول", "7 دول", "8 دول", "9 دول"],
    correctAnswer: 1,
    difficulty: "extreme",
    phase: 3,
    timeLimit: 10,
    basePoints: 1750,
    type: "multiple-choice",
  },
  {
    id: "Q15",
    question: "ما هو اسم أعلى قمة جبلية في المملكة العربية السعودية؟",
    answers: ["جبل السودة", "جبل فيروز", "جبل-lawz", "جبل طويق"],
    correctAnswer: 0,
    difficulty: "extreme",
    phase: 3,
    timeLimit: 10,
    basePoints: 2000,
    type: "multiple-choice",
  },
  {
    id: "Q16",
    question:
      "في أي عام تم اكتشاف النفط بكميات تجارية في المملكة (بئر الدمام رقم 7)؟",
    answers: ["1936", "1938", "1940", "1942"],
    correctAnswer: 1,
    difficulty: "extreme",
    phase: 3,
    timeLimit: 10,
    basePoints: 2500,
    type: "multiple-choice",
  },
  {
    id: "Q17",
    question: "ما هو اسم أول صحيفة سعودية صدرت في عهد الملك عبدالعزيز؟",
    answers: ["أم القرى", "الرياض", "عكاظ", "البلاد"],
    correctAnswer: 0,
    difficulty: "extreme",
    phase: 3,
    timeLimit: 10,
    basePoints: 3000,
    type: "multiple-choice",
  },
  {
    id: "Q18",
    question:
      "ما هو عدد آيات سورة الفتح المذكورة في علم المملكة العربية السعودية؟",
    answers: ["آية واحدة", "آيتان", "ثلاث آيات", "أربع آيات"],
    correctAnswer: 0,
    difficulty: "extreme",
    phase: 3,
    timeLimit: 10,
    basePoints: 3500,
    type: "multiple-choice",
  },
  {
    id: "Q19",
    question:
      "من هو المهندس المعماري الذي صمم المسجد النبوي في توسعة الملك فهد؟",
    answers: ["محمد مكية", "كمال إسماعيل", "راسم بدران", "زها حديد"],
    correctAnswer: 1,
    difficulty: "extreme",
    phase: 3,
    timeLimit: 10,
    basePoints: 4250,
    type: "multiple-choice",
  },
  {
    id: "Q20",
    question:
      "ما هو التاريخ الهجري لتأسيس المملكة العربية السعودية (إعلان التوحيد)؟",
    answers: [
      "21 جمادى الأولى 1351 هـ",
      "17 جمادى الأولى 1351 هـ",
      "21 جمادى الآخرة 1351 هـ",
      "17 جمادى الآخرة 1351 هـ",
    ],
    correctAnswer: 1,
    difficulty: "extreme",
    phase: 3,
    timeLimit: 10,
    basePoints: 5000,
    type: "multiple-choice",
  },
];

export const ALL_QUESTIONS = [...EASY_POOL, ...MEDIUM_HARD_POOL, ...FINAL_POOL];

export function getShuffledPhase1(): Question[] {
  return [...EASY_POOL].sort(() => Math.random() - 0.5);
}
export function getShuffledPhase2(): Question[] {
  return [...MEDIUM_HARD_POOL].sort(() => Math.random() - 0.5);
}
export function getGameQuestions(): Question[] {
  return [...getShuffledPhase1(), ...getShuffledPhase2(), ...FINAL_POOL];
}
