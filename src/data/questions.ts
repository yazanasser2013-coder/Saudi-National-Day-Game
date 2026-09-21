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
    basePoints: 150,
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
    basePoints: 200,
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
    basePoints: 250,
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
    basePoints: 300,
    type: "multiple-choice",
  },
];

export const MEDIUM_HARD_POOL: Question[] = [
  {
    id: "Q06",
    question:
      "في أي يوم من شهر سبتمبر عام 1932م تم إعلان توحيد المملكة رسمياً؟",
    answers: ["19 سبتمبر", "21 سبتمبر", "23 سبتمبر", "25 سبتمبر"],
    correctAnswer: 2,
    difficulty: "hard",
    phase: 2,
    timeLimit: 12,
    basePoints: 350,
    type: "multiple-choice",
  },
  {
    id: "Q07",
    question:
      "ما هو الاسم الذي كان يُعرف به الملك عبدالعزيز قبل توحيد المملكة؟",
    answers: [
      "أمير نجد",
      "سلطان نجد",
      "ملك الحجاز ونجد",
      "أمير مكة",
    ],
    correctAnswer: 0,
    difficulty: "hard",
    phase: 2,
    timeLimit: 12,
    basePoints: 400,
    type: "multiple-choice",
  },
  {
    id: "Q08",
    question:
      "كم عدد الآيات المكتوبة على العلم السعودي، وما هي سورتها؟",
    answers: [
      "آية واحدة - سورة الفتح",
      "آيتان - سورة البقرة",
      "ثلاث آيات - سورة آل عمران",
      "آية واحدة - سورة الكهف",
    ],
    correctAnswer: 0,
    difficulty: "hard",
    phase: 2,
    timeLimit: 12,
    basePoints: 450,
    type: "multiple-choice",
  },
  {
    id: "Q09",
    question:
      "كم عدد أبناء الملك عبدالعزيز الذكور من الذكور فقط ( الذين وصلوا سن الرشد)؟",
    answers: ["34 ولد", "36 ولد", "42 ولد", "45 ولد"],
    correctAnswer: 2,
    difficulty: "hard",
    phase: 2,
    timeLimit: 12,
    basePoints: 500,
    type: "multiple-choice",
  },
  {
    id: "Q10",
    question:
      "في عام 1992م، صدر نظام المناطق الإدارية الذي قسّم المملكة إلى كم منطقة؟",
    answers: ["11 منطقة", "13 منطقة", "15 منطقة", "17 منطقة"],
    correctAnswer: 1,
    difficulty: "hard",
    phase: 2,
    timeLimit: 12,
    basePoints: 550,
    type: "multiple-choice",
  },
];

export const FINAL_POOL: Question[] = [
  {
    id: "Q11",
    question:
      "في أي تاريخ هجري بالضبط تم توقيع اتفاقية التوحيد بين إمارة نجد والإحساء؟",
    answers: [
      "13 جمادى الأولى 1345هـ",
      "21 جمادى الأولى 1345هـ",
      "10 محرم 1345هـ",
      "13 رجب 1345هـ",
    ],
    correctAnswer: 0,
    difficulty: "extreme",
    phase: 3,
    timeLimit: 10,
    basePoints: 600,
    type: "multiple-choice",
  },
  {
    id: "Q12",
    question:
      "ما هو اسم المعركة التي خاضها الملك عبدالعزيز لاستعادة الأحساء من الأتراك عام 1913م؟",
    answers: [
      "معركة الحرق",
      "معركة جزيرة النعيم",
      "معركة الأحساء",
      "معركة فتح الرياض",
    ],
    correctAnswer: 2,
    difficulty: "extreme",
    phase: 3,
    timeLimit: 10,
    basePoints: 650,
    type: "multiple-choice",
  },
  {
    id: "Q13",
    question:
      "في أي عام بالضبط صدر أول نظام تعليمي في المملكة العربية السعودية؟",
    answers: ["1926", "1930", "1935", "1940"],
    correctAnswer: 1,
    difficulty: "extreme",
    phase: 3,
    timeLimit: 10,
    basePoints: 700,
    type: "multiple-choice",
  },
  {
    id: "Q14",
    question:
      "ما هو اسم أول طائرة حربية استخدمها الملك عبدالعزيز في حملاته العسكرية؟",
    answers: [
      "طائرة دي هافلاند",
      "طائرة فيكرز",
      "طائرة سوبمارين",
      "طائرة سباركان",
    ],
    correctAnswer: 0,
    difficulty: "extreme",
    phase: 3,
    timeLimit: 10,
    basePoints: 750,
    type: "multiple-choice",
  },
  {
    id: "Q15",
    question:
      "كم عدد الدول التي تحيط بالحدود البرية للمملكة العربية السعودية (عدا البحرين)؟",
    answers: ["7 دول", "8 دول", "9 دول", "10 دول"],
    correctAnswer: 1,
    difficulty: "extreme",
    phase: 3,
    timeLimit: 10,
    basePoints: 800,
    type: "multiple-choice",
  },
  {
    id: "Q16",
    question:
      "في أي عام بالضبط تم إنشاء أول خط بحري بين جدة والرياض؟",
    answers: ["1945", "1948", "1950", "1953"],
    correctAnswer: 2,
    difficulty: "extreme",
    phase: 3,
    timeLimit: 10,
    basePoints: 850,
    type: "multiple-choice",
  },
  {
    id: "Q17",
    question:
      "ما هو اسم أول جامعة حكومية تأسست في المملكة العربية السعودية؟",
    answers: [
      "جامعة الملك سعود",
      "جامعة الإمام محمد بن سعود",
      "جامعة الملك عبدالعزيز",
      "جامعة أم القرى",
    ],
    correctAnswer: 1,
    difficulty: "extreme",
    phase: 3,
    timeLimit: 10,
    basePoints: 900,
    type: "multiple-choice",
  },
  {
    id: "Q18",
    question:
      "في أي تاريخ بالضبط تم اكتشاف أول بئر نفطية تجارية في المملكة (بئر الدمام رقم 7)؟",
    answers: [
      "1 مارس 1936",
      "15 مارس 1938",
      "3 مارس 1938",
      "20 يناير 1938",
    ],
    correctAnswer: 2,
    difficulty: "extreme",
    phase: 3,
    timeLimit: 10,
    basePoints: 950,
    type: "multiple-choice",
  },
  {
    id: "Q19",
    question:
      "ما هو اسم أول صحفية سعودية حصلت على ملكية صحيفة في المملكة؟",
    answers: [
      "سميرة breeze",
      "رنا الحمود",
      "فاطمة الهاجري",
      "هند الشايف",
    ],
    correctAnswer: 0,
    difficulty: "extreme",
    phase: 3,
    timeLimit: 10,
    basePoints: 1000,
    type: "multiple-choice",
  },
  {
    id: "Q20",
    question:
      "ما هو التاريخ الهجري الدقيق لإعلان التوحيد (تأسيس المملكة العربية السعودية)؟",
    answers: [
      "21 جمادى الأولى 1351هـ",
      "17 جمادى الأولى 1351هـ",
      "21 جمادى الآخرة 1351هـ",
      "17 جمادى الآخرة 1351هـ",
    ],
    correctAnswer: 1,
    difficulty: "extreme",
    phase: 3,
    timeLimit: 10,
    basePoints: 1100,
    type: "multiple-choice",
  },
];

export const ALL_QUESTIONS = [...EASY_POOL, ...MEDIUM_HARD_POOL, ...FINAL_POOL];

function shuffleAnswers(questions: Question[]): Question[] {
  return questions.map((q) => {
    const correctAnswerText = q.answers[q.correctAnswer];
    const shuffled = [...q.answers].sort(() => Math.random() - 0.5);
    const newCorrectIndex = shuffled.indexOf(correctAnswerText);
    return { ...q, answers: shuffled, correctAnswer: newCorrectIndex };
  });
}

export function getShuffledPhase1(): Question[] {
  return shuffleAnswers([...EASY_POOL].sort(() => Math.random() - 0.5));
}
export function getShuffledPhase2(): Question[] {
  return shuffleAnswers([...MEDIUM_HARD_POOL].sort(() => Math.random() - 0.5));
}
export function getGameQuestions(): Question[] {
  return [...getShuffledPhase1(), ...getShuffledPhase2(), ...shuffleAnswers([...FINAL_POOL])];
}
